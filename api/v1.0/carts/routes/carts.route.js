'use strict';

/**
 * Module dependencies.
 */

import express from 'express';
import CartsService from '../controllers/carts.controller';
import {
  isUser,
  requires,
  isBody,
  assign
} from '../../auth/auth.service';
let router = express.Router();

router.post('/add-product', isUser.authenticated, requires.body, CartsService.add);

router.put('/:productID', isUser.authenticated, requires.body, CartsService.update);

router.get('/get', isUser.authenticated, CartsService.getOne);

router.get('/count', isUser.authenticated, CartsService.getCount);

router.delete('/:productID', isUser.authenticated, CartsService.remove);

export default router;
