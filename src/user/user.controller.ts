import {Request, Response, NextFunction} from 'express'
import { User } from './user.entity.nosql.js'
import { UserRepository } from './user.repository.js'

const userRepository = new UserRepository()

// Esta función se encarga de sanitizar (limpiar) los datos de entrada del usuario.
// Recibe el objeto Request, Response y NextFunction de Express como parámetros.
function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {
    // Se crea una propiedad "sanitizedInput" en el objeto req.body y se le asignan los valores
    // de los campos nickname, email, password, categoriesPreferences, favouriteList, rewardPoints y seller.
    req.body.sanitizedInput = { 
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.password,
        categoriesPreferences: req.body.categoriesPreferences,
        favouriteList: req.body.favouriteList,
        rewardPoints: req.body.rewardPoints,
        seller: req.body.seller
    }
    // Se realizan más chequeos de seguridad (no especificados en el código)

    // Se recorren todas las claves del objeto req.body.sanitizedInput
    // Si el valor de alguna clave es undefined, se elimina esa clave del objeto.
    Object.keys(req.body.sanitizedInput).forEach( key => {
        if (req.body.sanitizedInput[key] === undefined) { 
            delete req.body.sanitizedInput[key]
        }
    })
    // Se llama a la función next() para pasar al siguiente middleware en la cadena de middlewares de Express.
    next()

}

// Esta función se encarga de buscar y devolver todos los usuarios.
// Recibe el objeto Request y Response de Express como parámetros.
function findAll(req: Request, res: Response) {
    // Se llama al método findAll() del userRepository para obtener todos los usuarios.
    const users = userRepository.findAll()
    // Se envía la respuesta en formato JSON con los usuarios encontrados.
    res.json({ users })
}

// Esta función se encarga de buscar y devolver un usuario específico.
// Recibe el objeto Request y Response de Express como parámetros.
function findOne(req: Request, res: Response) {
    // Se obtiene el id del usuario a buscar desde los parámetros de la solicitud.
    const id = req.params.id
    // Se llama al método findOne() del userRepository para buscar el usuario por su id.
    const user = userRepository.findOne({ id })
    // Si no se encuentra ningún usuario con el id proporcionado, se devuelve un mensaje de error.
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    // Se envía la respuesta en formato JSON con el usuario encontrado.
    res.json({ data: user })
}

// Esta función se encarga de agregar un nuevo usuario.
// Recibe el objeto Request y Response de Express como parámetros.
function add(req: Request, res: Response) {
    // Se obtienen los datos del usuario sanitizados desde el cuerpo de la solicitud.
    const input = req.body.sanitizedInput

    // Se crea un nuevo objeto User con los datos del usuario.
    const userInput = new User(
        input.nickname,
        input.email,
        input.password,
        input.categoriesPreferences,
        input.favouriteList,
        input.rewardPoints,
        input.seller
    )

    // Se llama al método add() del userRepository para agregar el nuevo usuario.
    const user = userRepository.add(userInput)
    // Se devuelve una respuesta con el código de estado 201 (creado) y un mensaje de éxito junto con los datos del usuario.
    return res.status(201).send({ message: 'Usuario creado', data: user })
}

// Esta función se encarga de actualizar un usuario existente.
// Recibe el objeto Request y Response de Express como parámetros.
function update(req: Request, res: Response) {
    // Se asigna el id del usuario a actualizar desde los parámetros de la solicitud.
    req.body.sanitizedInput.id = req.params.id
    // Se llama al método update() del userRepository para actualizar el usuario.
    const user = userRepository.update(req.body.sanitizedInput)

    // Si no se encuentra ningún usuario con el id proporcionado, se devuelve un mensaje de error.
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Se devuelve una respuesta con el código de estado 200 (éxito) y un mensaje de éxito junto con los datos del usuario actualizado.
    return res.status(200).json({ message: 'Usuario actualizado exitosamente', data: user })
}

// Esta función se encarga de eliminar un usuario existente.
// Recibe el objeto Request y Response de Express como parámetros.
function remove(req: Request, res: Response) {
    // Se obtiene el id del usuario a eliminar desde los parámetros de la solicitud.
    const id = req.params.id
    // Se llama al método delete() del userRepository para eliminar el usuario por su id.
    const user = userRepository.remove({ id })

    // Si no se encuentra ningún usuario con el id proporcionado, se devuelve un mensaje de error.
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
    } else {
        // Se devuelve una respuesta con el código de estado 200 (éxito) y un mensaje de éxito junto con los datos del usuario eliminado.
        res.status(200).json({ message: 'Usuario eliminado exitosamente', data: user })
    }
}

// Se exportan todas las funciones para que puedan ser utilizadas en otros archivos.
export { sanitizeUserInput, findAll, findOne, add, update, remove }
