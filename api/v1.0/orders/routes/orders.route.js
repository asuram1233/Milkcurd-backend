'use strict';

/**
 * Module dependencies.
 */

import express from 'express';
import OrdersService from '../controllers/orders.controller';
import {
  isUser,
  requires,
  isBody,
  assign
} from '../../auth/auth.service';
let router = express.Router();

router.post('/add', isUser.authenticated, OrdersService.add);

router.get('/list/:type?', isUser.authenticated, OrdersService.list);

router.post('/add-status', isUser.authenticated, OrdersService.addStatus);

router.put('/:orderID', isUser.authenticated, requires.body, OrdersService.update);

router.get('/:orderID', isUser.authenticated, OrdersService.getOne);

router.delete('/:orderID', isUser.authenticated, OrdersService.remove);

export default router;
