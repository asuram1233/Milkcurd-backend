'use strict';

/**
 * Module dependencies.
 */

import express from 'express';
import UserController from '../controllers/users.controller';
import {
  isUser,
  requires,
  isBody,
  assign
} from '../../auth/auth.service';
let router = express.Router();

router.post('/register', requires.body, UserController.add);

router.post('/verify', requires.body, UserController.verify);

router.post('/forgot-password', requires.body, UserController.forgotPassword);

router.post('/resend-otp', requires.body, UserController.forgotPassword);

router.post('/set-password', requires.body, UserController.setPassword);

router.post('/login', requires.body, UserController.login);

router.get('/logout', isUser.authenticated, UserController.logout);

router.get('/profile', isUser.authenticated, UserController.getProfile);

router.get('/statistics', isUser.authenticated, isUser.hasPermission, UserController.statistics);

router.put('/profile', isUser.authenticated, requires.body, UserController.updateProfile);

router.delete('/:userID', isUser.authenticated, UserController.remove);

router.post('/add', requires.body, isUser.hasPermission, UserController.addUser);

router.get('/list/:userType?', isUser.authenticated, UserController.getList);

router.get('/:userID', isUser.authenticated, isUser.hasPermission, UserController.getUser);

router.put('/:userID', isUser.authenticated, isUser.hasPermission, UserController.update);

export default router;
