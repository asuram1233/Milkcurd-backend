'use strict';

/**
 * Module dependencies.
 */

import express from 'express';
import CategoriesService from '../controllers/categories.controller';
import {
  isUser,
  requires,
  isBody,
  assign
} from '../../auth/auth.service';
let router = express.Router();

router.post('/add', isUser.authenticated, isUser.hasPermission, requires.body, isBody.hasCategoryImage, CategoriesService.add);

router.get('/list', isUser.authenticated, isUser.hasPermission, CategoriesService.list);

router.put('/:categoryID', isUser.authenticated, isUser.hasPermission, requires.body, isBody.hasCategoryImage, CategoriesService.update);

router.get('/:categoryID', isUser.authenticated, isUser.hasPermission, CategoriesService.getOne);

router.delete('/:categoryID', isUser.authenticated, isUser.hasPermission, CategoriesService.remove);

export default router;
