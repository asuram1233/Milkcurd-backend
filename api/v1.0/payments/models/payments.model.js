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
  priceDetails: [],
  totalAmount: Number,
  transactionID: String,
  status: String,
  paymentType: String,
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default schema;
