'use strict';

/**
 * Module dependencies.
 */

import express from 'express';
import ProductsService from '../controllers/products.controller';
import {
  isUser,
  requires,
  isBody,
  assign
} from '../../auth/auth.service';
let router = express.Router();

router.post('/add', isUser.authenticated, isUser.hasPermission, requires.body, isBody.hasProductImage, isBody.hasCarouselImages, ProductsService.add);

router.get('/list/:categoryID?', isUser.authenticated, isUser.hasPermission, ProductsService.list);

router.put(
  "/:productID",
  isUser.authenticated,
  isUser.hasPermission,
  requires.body,
  isBody.hasProductImage,
  isBody.hasCarouselImages,
  ProductsService.update
);

router.get('/:productID', isUser.authenticated, isUser.hasPermission, ProductsService.getOne);

router.delete('/:productID', isUser.authenticated, isUser.hasPermission, ProductsService.remove);

export default router;
