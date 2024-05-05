# Propuesta TP DSW

## Grupo

### Integrantes
- 46876 - Zinni, Gonzalo.
- 51742 - Quaglia, Mateo.
- 46926 - Betes, Joaquin

## Tema
# DISCOVER IT

## Descripción del Proyecto:

Discover It es una aplicación donde los usuarios publican opiniones sobre puntos de interés (PdI) (lugares, restaurantes, música y eventos) mediante una calificación y un comentario. Cada usuario puede indicar sus preferencias (categorías de PdI) y el sistema le recomendará opciones similares con buenas puntuaciones. Los usuarios pueden seguir a otros, ganando credibilidad en la app. El sistema permite ingresar como un usuario invitado (anónimo) para ver los Puntos mejor calificados sin crear una cuenta antes. Los PdI también son creados por los mismos usuarios.

### Modelo
![imagen del modelo](Esquema_DCD_TP_DSW.jpg)


## Alcance Funcional 

Regularidad:
| Req               | Detalle                                                                                                 |
|-------------------|---------------------------------------------------------------------------------------------------------|
| CRUD simple       | 1. CRUD User <br> 2. CRUD PlaceProduct                                                                       |
| CRUD dependiente  | 1. CRUD Recomendation {depende de} CRUD PlaceProduct                                                    |
| Listado + detalle | 1. Listado de productos o lugares filtrado por tipo, muestra principales comentarios y recomendaciones. |
| CUU/Epic          | 1. Recomendar un producto/lugar <br> 2. Realizar un comentario                                               |  

### Alcance Mínimo

| Req      | Detalle  |
|:-|:-|
| CRUD     | 1. CRUD User<br> 2. CRUD PlaceProduct <br>3. CRUD Comment <br>4. CRUD Recomendation <br>5. CRUD Profile<br> 6. CRUD Reward |
| CUU/Epic | 1. Recomendar un producto/lugar <br>2. Realizar un comentario <br>3. Canjear recompensas acumuladas |
