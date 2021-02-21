"use strict";

import md5 from "md5";
import schema from "../models/users.model";

const findOne = (db, values) => {
  var User = db.model("users", schema);
  if (values.password) 
    values.password = md5(values.password);
  return User.findOne(values).exec();
};

const find = (db, values) => {
  var User = db.model("users", schema);
  return User.find(values)
    .select("-password")
    .exec();
};

const create = (db, values) => {
  var User = db.model("users", schema);
  if (values.password) values.password = md5(values.password);
  return User.create(values);
};

const insertMany = (db, values) => {
  var User = db.model("users", schema);
  return User.insertMany(values);
};

const findOneAndUpdate = (db, query, data) => {
  var User = db.model("users", schema);
  if (data.password)
    data.password = md5(data.password);
  return User.findOneAndUpdate(query, data, { new: true }).exec();
};

const getProfile = (db, values, selectables) => {
  var User = db.model("users", schema);
  return User.findOne(values)
    .select(selectables)
    .exec();
};

const deleteUser = (db, values) => {
  var User = db.model("users", schema);
  return User.remove(values).exec();
};

const get = (db, values) => {
  var User = db.model("users", schema);
  return User.find(values).exec();
};

const update = (db, query, values) => {
  var User = db.model("users", schema);
  if (values.password) 
    values.password = md5(values.password);
  return User.update(query, values, {multi: true}).exec();
};

const count = (db, query) => {
  var User = db.model("users", schema);
  return User.count(query);
};

const counts = (db, query = {}) => {
  var User = db.model("users", schema);
  return User.aggregate([
    { $match: query },
  ]).exec();
};


module.exports = {
  findOne,
  create,
  findOneAndUpdate,
  getProfile,
  deleteUser,
  find,
  count,
  get,
  counts,
  insertMany,
  update
};
