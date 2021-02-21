'use strict';

/**
 * Module dependencies.
 */

import express from 'express';
import MerchantsController from '../controllers/merchants.controller';

import {
    isUser,
    requires
} from '../../auth/auth.service';

let router = express.Router();

router.post('/add', requires.body, MerchantsController.add);

router.post('/validate', requires.body, MerchantsController.validate);

router.get('/list', isUser.authenticated, MerchantsController.list);

router.get('/:merchantID', isUser.authenticated, MerchantsController.getDetails);

router.get('/admin/:merchantID', isUser.authenticated, MerchantsController.getDetails);

router.put('/:merchantID', isUser.authenticated, requires.body, MerchantsController.update);

export default router;
