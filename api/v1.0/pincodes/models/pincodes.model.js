'use strict';

/**
 * Module dependencies.
 */
import mongoose from 'mongoose';
import Promise from 'bluebird';

const Schema = mongoose.Schema;
mongoose.Promise = Promise;

const schema = new Schema({
  pincode: { type: Number, required: true },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  stateID: {
    type: Schema.Types.ObjectId,
    ref: 'states'
  },
  cityID: {
    type: Schema.Types.ObjectId,
    ref: 'cities'
  },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default schema;
