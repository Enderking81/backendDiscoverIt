import {Router} from 'express';
import {findAll, findById, create, update, remove} from './notification.controller.js';

export const notificationRouter = Router();

notificationRouter.get('/', findAll);
notificationRouter.get('/:id', findById);
notificationRouter.post('/', create);
notificationRouter.put('/:id', update);
notificationRouter.patch('/:id', update);
notificationRouter.delete('/:id', remove);


