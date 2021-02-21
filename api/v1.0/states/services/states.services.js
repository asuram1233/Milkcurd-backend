'use strict';

import _ from 'lodash';
import md5 from 'md5';
import schema from '../models/states.model';

const findOne = (db, query) => {
  var State = db.model('states', schema);
  return State.findOne(query).exec();
};

const create = (db, data) => {
  var State = db.model('states', schema);
  return State.create(data);
};

const find = (db, query, selectables) => {
  var State = db.model('states', schema);
  return State.find(query).sort({ name: 1 }).select(selectables).exec();
};

const update = (db, query, data) => {
  var State = db.model('states', schema);
  return State.findOneAndUpdate(query, { $set: data }, { new: true }).exec();
};

const remove = (db, query) => {
  var State = db.model('states', schema);
  return State.remove(query).exec();
};

module.exports = {
  findOne,
  create,
  find,
  update,
  remove
};
