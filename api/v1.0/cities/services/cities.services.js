'use strict';

import _ from 'lodash';
import md5 from 'md5';
import schema from '../models/cities.model';

const findOne = (db, query) => {
  var City = db.model('cities', schema);
  return City.findOne(query).exec();
};

const create = (db, data) => {
  var City = db.model('cities', schema);
  return City.create(data);
};

const find = (db, query, selectables) => {
  var City = db.model('cities', schema);
  return City.find(query).sort({ name: 1 }).select(selectables).exec();
};

const update = (db, query, data) => {
  var City = db.model('cities', schema);
  return City.findOneAndUpdate(query, { $set: data }, { new: true }).exec();
};

const remove = (db, query) => {
  var City = db.model('cities', schema);
  return City.remove(query).exec();
};

module.exports = {
  findOne,
  create,
  find,
  update,
  remove
};
