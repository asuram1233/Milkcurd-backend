'use strict';

/**
 * Module dependencies.
 */

import express from 'express';
import citiesController from '../controllers/cities.controller';
import {
    isUser,
    requires
} from '../../auth/auth.service';
let router = express.Router();

router.post('/add', requires.body, citiesController.add);

router.put('/:cityID', isUser.auth, requires.body, citiesController.update);

router.delete('/:cityID', isUser.auth, citiesController.remove);

router.get('/list/:stateID', isUser.auth, citiesController.list);

export default router;
