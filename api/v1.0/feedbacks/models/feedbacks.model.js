'use strict';

/**
 * Module dependencies.
 */
import mongoose from 'mongoose';
import Promise from 'bluebird';
import md5 from 'md5';

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
  feedback: {type: String, required: true},
  rating: {type: Number, required: true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default schema;
