'use strict';

/**
 * Module dependencies.
 */
import mongoose from 'mongoose';
import Promise from 'bluebird';

const Schema = mongoose.Schema;
mongoose.Promise = Promise;

const schema = new Schema({
  name: { type: String, required: true },
  database: { type: String, required: true },
  storageFolder: { type: String, required: true },
  licenseKey: { type: String, required: true },
  accessKey: { type: String, required: true },
  merchantType: String, //school,college,university,institute,tutor,company
  merchantLogoKey: String,
  amountPaid: Number,
  amountPending: Number,
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('merchants', schema);
