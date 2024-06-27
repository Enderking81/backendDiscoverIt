import express, {Request} from 'express'
import { userRouter } from './user/user.routes.js'

import { User } from './user/user.entity.js'

const modelComment = require('./models').Comment
const modelPlaceProduct = require('./models').Place_Product
const modelRecommendation = require('./models').Recommendation
const modelUser = require('./models').User

const app = express()

// Importamos los modelos de la base de datos

// Configuración para manejar datos enviados en formularios
app.use(express.urlencoded({extended:true}))
app.use(express.json())

// Rutas relacionadas con los usuarios
app.use('/api/users', userRouter)

// Middleware para manejar rutas no encontradas
app.use((_, res) => {
  return res.status(404).send({ message: 'Recurso no encontrado' })
})

// Iniciamos el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000/')
})


