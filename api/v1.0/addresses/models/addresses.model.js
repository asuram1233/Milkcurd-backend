'use strict';

/**
 * Module dependencies.
 */
import mongoose from 'mongoose';
import Promise from 'bluebird';

const Schema = mongoose.Schema;
mongoose.Promise = Promise;

const schema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  userID: {
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
  pincodeID: {
    type: Schema.Types.ObjectId,
    ref: 'pincodes'
  },
  area: String,
  flatNo: String,
  floor: String,
  building: String,
  line1: String,
  line2: String,
  default: {type: Boolean, default: false},
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default schema;
