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
  categoryID: {
    type: Schema.Types.ObjectId,
    ref: 'categories'
  },
  name: { type:String, required: true },
  caption: String,
  description: String,
  imageKey: String,
  carouselImageKeys: [{
    imageKey: String,
    name: String,
    isActive: Boolean
  }],
  units: Number,
  measurement: String,
  actualPrice: { type: Number, default: 0 },
  currentPrice: { type: Number, default: 0 },
  status: { type: String, default: 'available' },
  quantity: Number,
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default schema;
