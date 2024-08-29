import { Category } from "./category.entity.js";
import { orm } from "../shared/db/orm.js"
import { Request, Response, NextFunction } from "express";

// Vo so el pipe??
const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const categories = await em.find(Category, {});
    return res.json(categories);
  } catch (error) {
    handleOrmError(res, error); // Maneja el error usando handleOrmError 
  }
}

async function create(req: Request, res: Response) {
  try { 
    const category = em.create(Category, res.locals.sanitizedInput);
    await em.flush();
    res.status(201).json({message: "Category created successfully", data: category});     
      }
      catch (error) { 
    handleOrmError(res, error);
    }
  }


async function findById(req: Request, res: Response) {
  try { 
    const category = await em.findOne(Category, {id: res.locals.id});
    res.json({data: category});
  } catch (error) {
    handleOrmError(res, error);
}
}

async function update(req: Request, res: Response) {
  try {
      const category = await em.findOneOrFail(Category, {id: res.locals.id});
      em.assign(Category, res.locals.sanitizedInput)
      await em.flush();
      res.json({message: "Category updated successfully", data: category});
    } catch (error) {
      handleOrmError(res, error);
    }
}


async function remove(req: Request, res: Response) {
  try {
    // Obtiene una referencia a la categoría sin cargarla completamente
    const categoryRef = em.getReference(Category, res.locals.id);

    // Elimina la entidad referenciada y sincroniza los cambios con la base de datos
    await em.removeAndFlush(categoryRef);

    // Responde con éxito
    res.json({ message: "Category deleted successfully", data: Category});
  } catch (err) {
    // Manejo de errores usando la función handleOrmError
    handleOrmError(res, err);
  }
}









// Función para verificar que los parámetros necesarios están presentes
function hasParams(body: any, requireAll: boolean) {
  const requiredFields = ['name', 'description'];
  if (requireAll) {
      return requiredFields.every(field => body[field] !== undefined && body[field] !== null && body[field].trim() !== '');
  } else {
      return requiredFields.some(field => body[field] !== undefined && body[field] !== null && body[field].trim() !== '');
  }
}
// Esta función se encarga de sanitizar la entrada de datos para la categoría.
// Verifica que se proporcionen los parámetros necesarios y los limpia de espacios en blanco.
// También elimina propiedades indefinidas del objeto de entrada.
function sanitizeCategoryInput(req: Request, res: Response, next: NextFunction) {
  const method = req.method;

  // Verifica que se proporcionen los parámetros necesarios para POST y PUT
  if (["POST", "PUT"].includes(method) && !hasParams(req.body, true)) {
    return res.status(400).json({ message: "Debe proporcionar todos los atributos" });
  }

  // Verificación del método PATCH
  if ("PATCH" === method && !hasParams(req.body, false)) {
    return res.status(400).json({ message: "Debe proporcionar al menos un atributo válido" });
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


// Esta función maneja los errores generados por el ORM y envía una respuesta adecuada al cliente.
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





export {findAll, create, findById, update, remove, handleOrmError, sanitizeCategoryInput} 