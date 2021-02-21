'use strict';

/**
 * Module dependencies.
 */

import express from 'express';
import statesController from '../controllers/states.controller';
import {
    isUser,
    requires
} from '../../auth/auth.service';
let router = express.Router();

/**
 * @api {post} /states/add Add States
 * @apiName Add
 * @apiGroup States
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *    	"name": "Mumbai",
 *      "isForeign": true
 *    }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *        "success": true,
 *        "message": "State added successfully"
 *    }
 *
 * @apiErrorExample {json} Error-Response - 1:
 *     HTTP/1.1 400 Already Exists
 *     {
 *       "success": false,
 *       "message": "State already exists in the database."
 *     }
 *
 * @apiErrorExample {json} Error-Response - 2:
 *     HTTP/1.1 500 Server Error
 *     {
 *       "success": false,
 *       "message": "Internal Server error. Please try after sometime."
 *     }
 *
 */

router.post('/add', requires.body, statesController.add);

router.put('/:stateID', isUser.auth, requires.body, statesController.update);

router.delete('/:stateID', isUser.auth, statesController.remove);

/**
 * @api {get} /states/list Get States
 * @apiName Get
 * @apiGroup States
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *        "success": true,
 *        "message": "States loaded successfully",
 *        "data": {
 *           "foreign": [{
 *                "_id": "5c081f890c1ad1102e3b2aac",
 *                "name": "State 1",
 *                "isForeign": true
 *            }],
 *           "local": [{
 *                "_id": "5c081f890c1ad1102e3b2aac",
 *                "name": "State 1",
 *                "isForeign": false
 *            }]
 *        }
 *    }
 *
 * @apiErrorExample {json} Error-Response - 1:
 *     HTTP/1.1 400 Error Response
 *     {
 *       "success": false,
 *       "message": "Error in loading states"
 *     }
 *
 * @apiErrorExample {json} Error-Response - 2:
 *     HTTP/1.1 500 Server Error
 *     {
 *       "success": false,
 *       "message": "Internal Server error. Please try after sometime."
 *     }
 *
 */

router.get('/list', statesController.list);

export default router;
