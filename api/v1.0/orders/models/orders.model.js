'use strict';

/**
 * Module dependencies.
 */
import mongoose from 'mongoose';
import Promise from 'bluebird';

const Schema = mongoose.Schema;
mongoose.Promise = Promise;

const schema = new Schema({
  orderID: { type: String, required: true },
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
    },
  }],
  paymentStatus: String,
  transactionID: String,
  paidAmount: Number,
  paymentType: String,
  address: {
    pincodeID: {
      type: Schema.Types.ObjectId,
      ref: 'pincodes'
    },
    stateID: {
      type: Schema.Types.ObjectId,
      ref: 'states'
    },
    cityID: {
      type: Schema.Types.ObjectId,
      ref: 'cities'
    },
    area: String,
    flatNo: String,
    floor: String,
    building: String,
    line1: String,
    line2: String
  },
  paymentID: {
    type: Schema.Types.ObjectId,
    ref: 'payments'
  },
  deliveryPersonID: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  status: { type: String, default: 'placed' },
  // statuses: [{
  //   status: String,
  //   createdAt: { type: Date, default: Date.now },
  //   createdBy: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'users'
  //   }
  // }],
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default schema;
