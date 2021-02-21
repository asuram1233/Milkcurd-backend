'use strict';

/**
 * Module dependencies.
 */
import mongoose from 'mongoose';
import Promise from 'bluebird';

const Schema = mongoose.Schema;
mongoose.Promise = Promise;

const schema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  orderID: {
    type: Schema.Types.ObjectId,
    ref: 'orders'
  },
  productIDs: [],
  deliveryDate: { 
    month: Number,
    day: Number,
    year: Number
  },
  status: { type: String, default: 'placed' },
  statuses: [{
    status: String,
    createdAt: { type: Date, default: Date.now },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
  }],
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default schema;
