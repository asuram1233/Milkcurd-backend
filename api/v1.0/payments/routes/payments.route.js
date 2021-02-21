'use strict';

/**
 * Module dependencies.
 */

import express from 'express';
import PaymentsService from '../controllers/payments.controller';
import {
  isUser,
  requires,
  isBody,
  assign
} from '../../auth/auth.service';
let router = express.Router();

router.post('/add', isUser.authenticated, isUser.hasPermission, requires.body, PaymentsService.add);

router.get('/list', isUser.authenticated, isUser.hasPermission, PaymentsService.list);

router.put('/:paymentID', isUser.authenticated, isUser.hasPermission, requires.body, PaymentsService.update);

router.get('/:paymentID', isUser.authenticated, isUser.hasPermission, PaymentsService.getOne);

export default router;
