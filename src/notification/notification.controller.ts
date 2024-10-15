import { orm } from "../shared/db/orm.js"
import { Request, Response, NextFunction } from "express";
import { Notification} from "./notification.entity.js";

const em = orm.em;

async function findAll(req: Request, res: Response) {
    try{ 
        const notifications = await em.find(Notification, {});
        return res.json(notifications);
   } catch (error) {
       handleOrmError(res, error);
   }
}   


async function findById(req: Request, res: Response) {
    try {
        const id = parseToInt(req.params.id);
        if (id === null) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const notification = await em.findOne(Notification, { NotificationId: id });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        return res.json(notification);
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


async function update(req: Request, res: Response) {
    try { 
        const notification = await em.findOneOrFail(Notification, { NotificationId: res.locals.id });
        em.assign(Notification, res.locals.sanitizedInput);
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




function parseToInt(value: any): number | null {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? null : parsed;
}


function handleOrmError(res: Response, error: any) {
    if (error.code){
        switch (error.code) {
            case 'ER_DUP_ENTRY':
                return res.status(400).json({ message: 'Duplicate entry' });
                break;
            case 'ER_NO_REFERENCED_ROW_2':
                return res.status(400).json({ message: 'Foreign key constraint fails' });
                break;
            default:
               res.status(500).json({ message: 'Internal server error' });
                break; 
        } 
    } else { 
        switch (error.name) {
            case 'EntityNotFoundError':
              res.status(404).json({ message: 'Entity not found' });
                break;
            default:
                res.status(500).json({ message: 'Internal server error' });
                break;
            }
        }
    }


export { findAll, findById, create, update, remove }