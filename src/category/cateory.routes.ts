import { Router } from "express"
import { findAll, findById, create, update, remove } from "./category.controller.js"

export const categoryRouter = Router()

categoryRouter.get('/', findAll)
categoryRouter.post('/', create)

categoryRouter.get('/{id}', findById)
categoryRouter.put('/{id}', update)
categoryRouter.patch('/{id}', update)
categoryRouter.delete('/{id}', remove)

/*

GET /api/cats   <- HTTP
  findAll()     <- Qué hace el ctrl en base a lo que viene

POST /api/cats
  create(req.body)

GET /api/cats/1
  findById(1)

*/