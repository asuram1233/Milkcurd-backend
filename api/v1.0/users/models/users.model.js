'use strict';

/**
 * Module dependencies.
 */
import mongoose from 'mongoose';
import Promise from 'bluebird';

const Schema = mongoose.Schema;
mongoose.Promise = Promise;

const schema = new Schema({
  firstName: {
    type: String,
    default: "User",
    required: true
  },
  lastName: String,
  email: String,
  prefix: {type: String, default: "+91"},
  mobile: {type: Number, required: true },
  userType: {
    type: String,
    default: "customer"
  }, //customer, superadmin, admin, delivery
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  otp: String,
  profilePicKey: String,
  verified: { type: Boolean, default: false },
  devicesCount: {type: Number, default: 0, min:0, max: 3},
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default schema;
