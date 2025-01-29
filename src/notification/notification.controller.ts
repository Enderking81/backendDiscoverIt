import {Request, Response, NextFunction} from 'express'
import {orm} from '../shared/db/orm'
import {Notification} from './notification.entity'

const em = orm.em;

async function findAll(req: Request, res: Response) {
    try {
        const notifications = await em.find(Notification, {});
        return res.json(notifications);
    } catch (error) {
        handleOrmError(res, error);
    }
}

async function create(req: Request, res: Response) {  
    try {
        const newNotification = em.create(Notification, res.locals.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: "Notification created successfully", data: newNotification });
    } catch (error) {
        handleOrmError(res, error);
    }
}

async function findById(req: Request, res: Response) {
    try {
        const notification = await em.findOne(Notification, { id: res.locals.id });
        res.json({ data: notification });
    } catch (error) {
        handleOrmError(res, error);
    }
}

async function update(req: Request, res: Response) {
    try {
        const notification = await em.findOneOrFail(Notification, { id: res.locals.id });
        em.assign(Notification, res.locals.sanitizedInput)
        await em.flush();
        res.json({ message: "Notification updated successfully", data: notification });
    } catch (error) {
        handleOrmError(res, error);
    }
}

async function remove(req: Request, res: Response) {
    try {
        const notificationRef = em.getReference(Notification, res.locals.id);
        await em.removeAndFlush(notificationRef);
        res.json({ message: "Notification deleted successfully", data: Notification });
    } catch (error) {
        handleOrmError(res, error);
    }
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

export {findAll, create, findById, update, remove, handleOrmError}