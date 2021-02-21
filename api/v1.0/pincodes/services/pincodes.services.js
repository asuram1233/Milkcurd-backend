'use strict';

import _ from 'lodash';
import md5 from 'md5';
import schema from '../models/pincodes.model';

const findOne = (db, query) => {
  var Pincode = db.model('pincodes', schema);
  return Pincode.findOne(query).exec();
};

const create = (db, data) => {
  var Pincode = db.model('pincodes', schema);
  return Pincode.create(data);
};

const find = (db, query, selectables) => {
  var Pincode = db.model('pincodes', schema);
  return Pincode.find(query).sort({ name: 1 }).select(selectables).exec();
};

const update = (db, query, data) => {
  var Pincode = db.model('pincodes', schema);
  return Pincode.findOneAndUpdate(query, { $set: data }, { new: true }).exec();
};

const remove = (db, query) => {
  var Pincode = db.model('pincodes', schema);
  return Pincode.remove(query).exec();
};

module.exports = {
  findOne,
  create,
  find,
  update,
  remove
};
