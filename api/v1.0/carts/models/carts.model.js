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
  products: [{
    categoryID: {
      type: Schema.Types.ObjectId,
      ref: 'categories'
    },
    productID: {
      type: Schema.Types.ObjectId,
      ref: 'products'
    },
    quantity: Number,
    units: Number,
    measurement: String,
    delivery: {
      deliverType: String,
      startDate: Date,
      endDate: Date,
      customDays: [],
      startTime: String,
      endTime: String
    }
  }],
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default schema;
