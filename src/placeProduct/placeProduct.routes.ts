import { Router } from "express";
import { findAll, findById, create, update, remove } from "./placeProduct.controller.js";


export const placeProductRouter = Router();

// Obtiene todos los productos de lugar
placeProductRouter.get('/', findAll);
// Crea un nuevo producto de lugar
placeProductRouter.post('/', create);


// Obtiene un producto de lugar por su ID
placeProductRouter.get('/:id', findById);
// Actualiza un producto de lugar por su ID
placeProductRouter.put('/:id', update);
// Actualiza parcialmente un producto de lugar por su ID
placeProductRouter.patch('/:id', update);
// Elimina un producto de lugar por su ID
placeProductRouter.delete('/:id', remove);
