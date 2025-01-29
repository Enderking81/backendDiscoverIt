import {Router} from 'express';
import {findAll, findById, create, update, remove} from './notification.controller';

export const notificationRouter = Router();

notificationRouter.get('/', findAll);
notificationRouter.post('/', create);
notificationRouter.get('/:id', findById);
notificationRouter.put('/:id', update);
notificationRouter.patch('/:id', update);
notificationRouter.delete('/:id', remove);