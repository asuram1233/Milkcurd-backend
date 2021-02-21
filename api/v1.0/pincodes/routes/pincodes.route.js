'use strict';

/**
 * Module dependencies.
 */

import express from 'express';
import pincodesController from '../controllers/pincodes.controller';
import {
    isUser,
    requires
} from '../../auth/auth.service';
let router = express.Router();

router.post('/add', requires.body, pincodesController.add);

router.put('/:pincodeID', isUser.auth, requires.body, pincodesController.update);

router.delete('/:pincodeID', isUser.auth, pincodesController.remove);

router.get('/list/:stateID/:cityID', isUser.auth, pincodesController.list);

export default router;
