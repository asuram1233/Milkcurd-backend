'use strict';

/**
 * Module dependencies.
 */

import express from 'express';
import AddressesService from '../controllers/addresses.controller';
import {
  isUser,
  requires,
} from '../../auth/auth.service';
let router = express.Router();

router.post('/add', isUser.authenticated, requires.body, AddressesService.add);

router.get('/list', isUser.authenticated, AddressesService.list);

router.put('/:addressID', isUser.authenticated, requires.body, AddressesService.update);

router.get('/:addressID', isUser.authenticated, AddressesService.getOne);

router.delete('/:addressID', isUser.authenticated, AddressesService.remove);

export default router;
