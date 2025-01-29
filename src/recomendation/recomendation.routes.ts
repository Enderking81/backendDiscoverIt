import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeRecomendationInput } from "./recomendation.controller.js";

export const recomendationRouter = Router();

recomendationRouter.get("/", findAll);


recomendationRouter.post("/", add);
recomendationRouter.get('/:id', findOne)
recomendationRouter.put('/:id', sanitizeRecomendationInput, update)
recomendationRouter.patch('/:id', sanitizeRecomendationInput, update)
recomendationRouter.delete('/:id', remove)