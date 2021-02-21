"use strict";

import md5 from "md5";
import schema from "../models/categories.model";

const findOne = (db, values, selectables) => {
  var Category = db.model("categories", schema);
  return Category.findOne(values).select(selectables).exec();
};

const find = (db, values, selectables) => {
  var Category = db.model("categories", schema);
  return Category.find(values)
    .select(selectables)
    .exec();
};

const create = (db, values) => {
  var Category = db.model("categories", schema);
  return Category.create(values);
};

const insertMany = (db, values) => {
  var Category = db.model("categories", schema);
  return Category.insertMany(values);
};

const findOneAndUpdate = (db, query, data) => {
  var Category = db.model("categories", schema);
  return Category.findOneAndUpdate(query, data, { new: true }).exec();
};

const get = (db, values) => {
  var Category = db.model("categories", schema);
  return Category.find(values).exec();
};

const update = (db, query, values) => {
  var Category = db.model("categories", schema);
  return Category.update(query, values, {multi: true}).exec();
};

const count = (db, query) => {
  var Category = db.model("categories", schema);
  return Category.count(query);
};

module.exports = {
  findOne,
  create,
  findOneAndUpdate,
  find,
  count,
  get,
  insertMany,
  update
};
