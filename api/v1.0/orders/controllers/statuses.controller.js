'use strict';
/**
 * Module dependencies.
 */
import OrdersService from '../services/orders.services';
import StatusesService from '../services/statuses.services';

import mongoose from "mongoose";
import moment from "moment";

const objectId = mongoose.Types.ObjectId;

import schedule from "node-schedule";
import { productDeliverable } from '../../../../common/utils';

async function updateOrders() {

   
    return StatusesService.findOne(database, query)

}
