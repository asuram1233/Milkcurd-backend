'use strict';

import _ from 'lodash';
import md5 from 'md5';
import schema from '../models/feedbacks.model';

import usersSchema from '../../users/models/users.model';

const findOne = (db, query) => {
  var Feedbacks = db.model('feedbacks', schema);
  return Feedbacks.findOne(query).exec();
};

const create = (db, data) => {
  var Feedbacks = db.model('feedbacks', schema);
  return Feedbacks.create(data);
};

const find = (db, query) => {
  var Feedbacks = db.model('feedbacks', schema);
  return Feedbacks.find(query).exec();
};

const count = (db, query) => {
  var Feedbacks = db.model('feedbacks', schema);
  return Feedbacks.count(query).exec();
};

const remove = (db, query) => {
  var Feedbacks = db.model('feedbacks', schema);
  return Feedbacks.remove(query).exec();
};

const findOneAndPopulate = (db, query) => {
  var Feedbacks = db.model('feedbacks', schema);

  db.model('users', usersSchema);

  return Feedbacks.findOne(query)
    .populate("userID")
    .exec();
};

const findAndPopulate = (db, query) => {
  var Feedbacks = db.model('feedbacks', schema);

  db.model('users', usersSchema);

  return Feedbacks.find(query)
    .populate("userID", "firstName lastName email mobile profilePicKey")
    .exec();
};

module.exports = {
  findOne,
  create,
  find,
  count,
  remove,
  findOneAndPopulate,
  findAndPopulate
};
