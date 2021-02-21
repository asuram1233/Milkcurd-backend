'use strict';

/**
 * Module dependencies.
 */

import express from 'express';
import FeedbacksController from '../controllers/feedbacks.controller';
import {
    isUser,
    requires
} from '../../auth/auth.service';
let router = express.Router();

router.post('/add', isUser.authenticated, requires.body, FeedbacksController.add);

router.get('/list/:orderID?', isUser.authenticated, FeedbacksController.list);

export default router;
