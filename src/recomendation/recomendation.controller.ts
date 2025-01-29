import { orm } from "../shared/db/orm.js"
import { Request, Response, NextFunction } from "express";
import { Recomendation } from "./recomendation.entity.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
    try {
        const recomendations = await em.find(Recomendation, {});
        return res.json(recomendations);
    } catch (error) {
        handleOrmError(res, error);
    }
    }

async function add(req: Request, res: Response) {
    try {
        const newRecomendation = em.create(Recomendation, res.locals.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: "recomendation created successfully", data: newRecomendation });
    } catch (error) {
        handleOrmError(res, error);
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const recomendation = await em.findOne(Recomendation, { id: res.locals.id });
        res.json({ data: recomendation });
    } catch (error) {
        handleOrmError(res, error);
    }
}

async function update(req: Request, res: Response) {
    try {
        const recomendation = await em.findOneOrFail(Recomendation, { id: res.locals.id });
        em.assign(Recomendation, res.locals.sanitizedInput)
        await em.flush();
        res.json({ message: "recomendation updated successfully", data: recomendation });
    } catch (error) {
        handleOrmError(res, error);
    }
}

async function remove(req: Request, res: Response) {
    try {
        const recomendationRef = em.getReference(Recomendation, res.locals.id);
        await em.removeAndFlush(recomendationRef);
        res.json({ message: "recomendation deleted successfully", data: Recomendation });
    } catch (error) {
        handleOrmError(res, error);
    }
}



function hasParams(body: any, requireAll: boolean) {
    const requiredFields = ['name', 'description'];
    if (requireAll) {
        return requiredFields.every(field => body[field] !== undefined && body[field] !== null && body[field].trim() !== '');
    } else {
        return requiredFields.some(field => body[field] !== undefined && body[field] !== null && body[field].trim() !== '');
    }
  }
 
  function sanitizeRecomendationInput(req: Request, res: Response, next: NextFunction) {
    const method = req.method;
  
    // Verifica que se proporcionen los parámetros necesarios para POST y PUT
    if (["POST", "PUT"].includes(method) && !hasParams(req.body, true)) {
      return res.status(400).json({ message: "mandatory parameters are missing" });
    }
  
    // Verificación del método PATCH
    if ("PATCH" === method && !hasParams(req.body, false)) {
      return res.status(400).json({ message: "At least one parameter is required" });
    }
  
    // Sanitiza la entrada
    res.locals.sanitizedInput = {
      name: typeof req.body.name === 'string' ? req.body.name.trim() : undefined,
      description: typeof req.body.description === 'string' ? req.body.description.trim() : undefined,
      site: typeof req.body.site === 'string' ? req.body.site.trim() : undefined
    };
  
    const sanitizedInput = res.locals.sanitizedInput;
  
    // Expresión regular para validar URLs
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  
    // Valida y sanitiza el campo de URL
    if (sanitizedInput.site && !urlRegex.test(sanitizedInput.site)) {
      sanitizedInput.site = undefined;
    }
  
    // Elimina propiedades indefinidas o vacías
    Object.keys(sanitizedInput).forEach((key) => {
      if (sanitizedInput[key] === undefined || sanitizedInput[key].trim() === '') {
        delete sanitizedInput[key];
      }
    });
  
    next();
  }



    function handleOrmError(res: Response, err: any) {
        if (err.code) {
          switch (err.code) {
            case "ER_DUP_ENTRY":
              res.status(400).json({ message: "A tag with that name/site already exists." });
              break;
            case "ER_DATA_TOO_LONG":
              res.status(400).json({ message: "Data too long." });
              break;
            default:
              res.status(400).json({ message: `Database error occurred: ${err.code}` });
              break;
          }
        } else {
          switch (err.name) {
            case "NotFoundError":
              res.status(404).json({ message: `Tag not found for ID ${res.locals.id}` });
              break;
            default:
              console.error("\n--- ORM ERROR ---");
              console.error(err.message);
              res.status(500).json({ message: "Oops! Something went wrong. This is our fault." });
              break;
          }
        }
      }

    
export {findAll, add, findOne, update, remove, handleOrmError, sanitizeRecomendationInput}