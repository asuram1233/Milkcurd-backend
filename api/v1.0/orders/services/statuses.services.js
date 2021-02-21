"use strict";

import md5 from "md5";
import schema from "../models/statuses.model";

const findOne = (db, values, selectables) => {
  var Order = db.model("deliverystatuses", schema);
  return Order.findOne(values)
    .select(selectables).exec();
};

const find = (db, values, selectables) => {
  var Order = db.model("deliverystatuses", schema);
  return Order.find(values)
    .select(selectables)
    .exec();
};

const create = (db, values) => {
  var Order = db.model("deliverystatuses", schema);
  return Order.create(values);
};

const insertMany = (db, values) => {
  var Order = db.model("deliverystatuses", schema);
  return Order.insertMany(values);
};

const findOneAndUpdate = (db, query, data) => {
  var Order = db.model("deliverystatuses", schema);
  return Order.findOneAndUpdate(query, data, { new: true }).exec();
};

const get = (db, values) => {
  var Order = db.model("deliverystatuses", schema);
  return Order.find(values).exec();
};

const getOne = (db, values) => {
  var Order = db.model("deliverystatuses", schema);
  return Order.findOne(values).exec();
};

const update = (db, query, values) => {
  var Order = db.model("deliverystatuses", schema);
  return Order.update(query, values, {multi: true}).exec();
};

const count = (db, query) => {
  var Order = db.model("deliverystatuses", schema);
  return Order.count(query);
};

module.exports = {
  findOne,
  create,
  findOneAndUpdate,
  find,
  count,
  get,
  insertMany,
  update,
  getOne
};
