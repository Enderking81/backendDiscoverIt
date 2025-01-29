import { Router } from "express";
import { findAll, findById, create, update, remove } from "./placeProduct.controller.js";


export const placeProductRouter = Router();

placeProductRouter.get('/', findAll);
placeProductRouter.post('/', create);
placeProductRouter.get('/:id', findById);
placeProductRouter.put('/:id', update);
placeProductRouter.patch('/:id', update);
placeProductRouter.delete('/:id', remove);
