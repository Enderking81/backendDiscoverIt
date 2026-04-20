# Guía de Defensa — DiscoverIt Backend V2.0

Preguntas y respuestas técnicas que pueden surgir en la defensa oral.

---

## Configuración de la base de datos con dotenv

**¿Por qué usás un archivo .env en lugar de hardcodear las credenciales?**
Si las credenciales están en el código y el repositorio es público (o se filtra), cualquiera puede acceder a la base de datos. Con `.env` las credenciales quedan fuera del repo (está en `.gitignore`) y cada desarrollador o servidor tiene sus propios valores.

**¿Qué es dotenv y cómo funciona?**
Es una librería que lee el archivo `.env` de la raíz del proyecto y carga cada línea como variable de entorno en `process.env`. Se llama con `require('dotenv').config()` al inicio del proceso.

**¿Por qué creaste `config/config.js` en lugar de usar `config.json`?**
`config.json` es estático y no puede ejecutar código. Para leer variables de entorno necesitamos JavaScript. Con `config.js` podemos llamar a `dotenv` y construir el objeto de configuración dinámicamente.

**¿Para qué sirve el archivo `.sequelizerc`?**
Le indica a `sequelize-cli` dónde encontrar cada parte del proyecto: el archivo de config, los modelos, las migraciones y los seeders. Sin él, la CLI busca `config/config.json` por defecto y no encuentra nuestro `config.js`.

**¿Qué variables define el .env de este proyecto?**
```
dbHost    → host del servidor MySQL (localhost)
dbPort    → puerto (3306 por defecto)
dbUser    → usuario de la DB
dbPasswd  → contraseña
dbName    → nombre de la base de datos (discover_it)
privateKey → clave secreta para JWT (equivalente a JWT_SECRET)
```

**¿Cómo se conecta config.js con esas variables?**
```js
require('dotenv').config(); // carga el .env
module.exports = {
  development: {
    username: process.env.dbUser,
    password: process.env.dbPasswd,
    database: process.env.dbName,
    host:     process.env.dbHost,
    dialect:  'mysql'
  }
};
```

**¿Qué son las migraciones y por qué se corren en orden?**
Cada migración es un archivo con timestamp en el nombre. Sequelize las corre de menor a mayor timestamp y registra cuáles ya aplicó en la tabla `SequelizeMeta`. Así puede saber qué quedó pendiente y nunca repetir una migración ya aplicada.

**¿Qué son los seeders?**
Son archivos que insertan datos iniciales en la base de datos. En este proyecto se usó para poblar la tabla `Categories` con 8 categorías reales (Restaurantes, Museos, Bares, etc.). Son útiles para desarrollo y para tener datos de prueba en la demo.

**¿Cómo revertís un seeder si te equivocaste?**
```bash
npx sequelize-cli db:seed:undo          # revierte el último seeder
npx sequelize-cli db:seed:undo:all      # revierte todos los seeders
```
El método `down` de cada seeder define qué hacer al revertir (en nuestro caso, borra todas las categorías con `bulkDelete`).

---

## bcrypt y seguridad de contraseñas

**¿Por qué usás bcrypt y no MD5 o SHA?**
MD5 y SHA son funciones de hash rápidas: un atacante puede probar millones de combinaciones por segundo. bcrypt tiene un factor de costo configurable (usamos 10) que hace el proceso deliberadamente lento, lo que hace inviable un ataque de fuerza bruta.

**¿Qué es el "salt" en bcrypt?**
Es un valor aleatorio que se agrega a la contraseña antes de hashear. Hace que dos usuarios con la misma contraseña tengan hashes distintos, eliminando los ataques por tabla arcoíris (rainbow tables).

**¿Dónde se llama el hash en el código?**
En el hook `beforeCreate` del modelo User. Así nunca se puede crear un usuario sin que la contraseña quede hasheada, aunque el programador lo olvide en la ruta.

**¿Cómo verificás la contraseña en el login?**
Con `bcrypt.compareSync(textoPlano, hashGuardado)` en el método `validPassword`. bcrypt extrae el salt del hash y rehashea el texto plano para comparar.

---

## JWT — JSON Web Tokens

**¿Qué es un JWT y qué contiene?**
Es un token firmado digitalmente con tres partes: header (algoritmo), payload (datos del usuario) y firma. En nuestro caso el payload tiene `id` e `isAdmin`. Cualquiera puede decodificar el payload, pero no puede modificarlo sin invalidar la firma.

**¿Por qué incluís `isAdmin` en el token?**
Para no ir a la base de datos en cada request a verificar si el usuario es admin. El middleware `isAdmin` solo lee `req.isAdmin`, que viene del token ya verificado.

**¿Qué pasa si el token expira?**
`jwt.verify` devuelve un error y el middleware responde con 403. El cliente debe hacer login de nuevo para obtener un token fresco.

**¿Dónde guardás el JWT_SECRET?**
En una variable de entorno (`process.env.JWT_SECRET`). El valor hardcodeado en el código es solo un fallback para desarrollo local, nunca para producción.

---

## Middlewares de autenticación y autorización

**¿Cuál es la diferencia entre autenticación y autorización?**
Autenticación verifica *quién sos* (verifyToken). Autorización verifica *qué podés hacer* (isAdmin). Son dos pasos distintos y se usan en ese orden.

**¿Cómo se encadenan los middlewares en una ruta protegida?**
```js
router.delete('/admin/lugar/:id', verifyToken, isAdmin, controlador);
```
Express los ejecuta en orden. Si `verifyToken` falla, nunca llega a `isAdmin` ni al controlador.

**¿Por qué `isAdmin` debe ir después de `verifyToken`?**
Porque depende de `req.isAdmin`, que solo existe después de que `verifyToken` decodifica el token y lo asigna al request.

---

## Relación Many-to-Many — UserLikes

**¿Qué es una relación Many-to-Many y cómo se implementa?**
Un usuario puede dar like a muchos lugares, y un lugar puede tener likes de muchos usuarios. En SQL esto se implementa con una tabla intermedia (UserLikes) que tiene dos claves foráneas: userId y placeProductId.

**¿Por qué usás `belongsToMany` en ambos lados?**
Porque Sequelize necesita que ambos modelos declaren la relación para poder navegar en los dos sentidos: `user.getPlace_Products()` y `placeProduct.getUsers()`.

**¿Qué pasa si borrás un usuario o un Place_Product?**
La migración define `onDelete: 'CASCADE'`, así que los registros de UserLikes relacionados se borran automáticamente. Evita huérfanos en la tabla intermedia.

**¿Por qué el modelo se llama UserLike pero la tabla UserLikes?**
Sequelize pluraliza los nombres de tabla. Con `tableName: 'UserLikes'` lo hacemos explícito para evitar que Sequelize genere un nombre inesperado.

---

## isAdmin en User

**¿Por qué `isAdmin` tiene `defaultValue: false`?**
Para que ningún usuario sea admin por accidente. El privilegio de admin se asigna manualmente (directo en DB o con un script de seeder), nunca por el flujo de registro normal.

**¿Cómo harías para que el primer usuario registrado sea admin?**
Con un seeder que actualice `isAdmin = true` para ese usuario específico, o con una ruta protegida que solo el sistema pueda usar.

---

## description en Recommendation

**¿Por qué `description` es de tipo TEXT y no STRING?**
STRING en Sequelize mapea a `VARCHAR(255)`, que limita a 255 caracteres. TEXT no tiene límite práctico, ideal para una opinión libre del usuario.

**¿Puede ser null?**
Sí, es opcional (`allowNull: true` en la migración). Un usuario puede recomendar con solo puntaje sin escribir texto.

---

## Migraciones

**¿Por qué usás migraciones en lugar de `sync({ force: true })`?**
`sync force` borra y recrea todas las tablas, destruyendo datos en producción. Las migraciones son incrementales, reversibles con `db:migrate:undo`, y llevan historial de cambios en el repositorio.

**¿Cómo revertís una migración?**
```bash
npx sequelize-cli db:migrate:undo
```
Ejecuta el método `down` de la última migración aplicada.

---

## Preguntas generales de arquitectura

**¿Por qué separás modelos, rutas y middlewares en carpetas distintas?**
Separación de responsabilidades (SoC). El modelo sabe qué datos existen, la ruta sabe qué endpoints exponer, el middleware sabe qué validar. Si cambia la lógica de auth, solo tocás `middlewares/auth.js`.

**¿Qué es Sequelize y por qué lo usás?**
Es un ORM (Object-Relational Mapper) para Node.js. Permite trabajar con la base de datos usando objetos JavaScript en lugar de SQL crudo, y maneja las diferencias entre distintos motores de DB.

**¿Cómo escalarías este sistema de likes si tuvieras millones de registros?**
Agregaría un índice compuesto en `(userId, placeProductId)` en la tabla UserLikes para que las búsquedas sean O(log n) en lugar de O(n). También podría cachear el conteo de likes con Redis.

---

## Rutas de comentarios y recomendaciones

**¿Por qué el `idUser` viene del token y no del body en el POST de comentarios?**
Si el cliente enviara el `idUser` en el body, cualquier usuario podría mandar el id de otro y comentar en su nombre. Al leerlo de `req.userId` (que viene del token ya verificado por el middleware), garantizamos que nadie puede suplantar a otro.

**¿Por qué un usuario no puede recomendar el mismo lugar dos veces?**
Una recomendación doble distorsionaría el promedio. El backend hace un `findOne` antes de crear y devuelve 409 si ya existe. En un sistema real también habría una constraint UNIQUE en la DB sobre `(idUser, idPlaceProduct)`.

**¿Cómo se calcula el `average_rating`?**
Cada vez que se crea, edita o borra una recomendación, el backend busca todas las recomendaciones del lugar, suma los puntos, divide por la cantidad y actualiza el campo `average_rating` en `Place_Product`. Así el promedio siempre está actualizado sin calcular en cada GET.

**¿Por qué validás que el puntaje esté entre 1 y 5?**
Es una regla de negocio: un puntaje fuera de rango haría que el promedio sea imposible de interpretar. La validación en la ruta es la primera línea de defensa; en un sistema robusto también iría una constraint en el modelo de Sequelize (`validate: { min: 1, max: 5 }`).

**¿Qué devuelve `findOrCreate` y para qué lo usás en likes?**
Devuelve un array `[instancia, created]` donde `created` es `true` si se creó o `false` si ya existía. Lo usamos en `POST /likes` para manejar el duplicado en una sola operación atómica, evitando una race condition que podría ocurrir si primero hacemos `findOne` y después `create` por separado.

**¿Por qué usás `order: [['datetimecomment', 'DESC']]` en los comentarios?**
Para que el cliente reciba los comentarios más recientes primero, sin tener que ordenarlos del lado del frontend. Es una decisión de UX implementada en la capa de datos.

**¿Qué pasa con el `average_rating` si se borran todas las recomendaciones de un lugar?**
El backend lo pone en `null` explícitamente. Así el frontend puede distinguir entre "ninguna recomendación todavía" (null) y "el promedio es 0" (que sería un estado imposible con puntajes de 1 a 5).

---

## Endpoints disponibles — resumen para la demo

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /auth/register | libre | registra un usuario nuevo |
| POST | /auth/login | libre | devuelve token JWT |
| GET | /places | libre | lista lugares con categoría |
| GET | /places/:id | libre | detalle con comentarios y recomendaciones |
| POST | /places | logueado | crea un lugar |
| PUT | /places/:id | logueado | edita un lugar |
| DELETE | /places/:id | admin | elimina un lugar |
| GET | /likes | logueado | mis lugares favoritos |
| POST | /likes/:id | logueado | dar like |
| DELETE | /likes/:id | logueado | sacar like |
| GET | /comments/:placeId | libre | comentarios de un lugar |
| POST | /comments | logueado | comentar un lugar |
| DELETE | /comments/:id | autor | borrar propio comentario |
| GET | /recommendations/:placeId | libre | recomendaciones de un lugar |
| POST | /recommendations | logueado | recomendar con puntaje |
| PUT | /recommendations/:id | autor | editar propia recomendación |
| DELETE | /recommendations/:id | autor | borrar propia recomendación |
