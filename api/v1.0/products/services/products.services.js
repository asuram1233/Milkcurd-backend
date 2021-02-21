"use strict";

import md5 from "md5";
import schema from "../models/products.model";

const findOne = (db, values, selectables) => {
  var Product = db.model("products", schema);
  return Product.findOne(values).select(selectables).exec();
};

const find = (db, values, selectables) => {
  var Product = db.model("products", schema);
  return Product.find(values)
    .select(selectables)
    .exec();
};

const create = (db, values) => {
  var Product = db.model("products", schema);
  return Product.create(values);
};

const insertMany = (db, values) => {
  var Product = db.model("products", schema);
  return Product.insertMany(values);
};

const findOneAndUpdate = (db, query, data) => {
  var Product = db.model("products", schema);
  return Product.findOneAndUpdate(query, data, { new: true }).exec();
};

const get = (db, values) => {
  var Product = db.model("products", schema);
  return Product.find(values).exec();
};

const update = (db, query, values) => {
  var Product = db.model("products", schema);
  return Product.update(query, values, {multi: true}).exec();
};

const count = (db, query) => {
  var Product = db.model("products", schema);
  return Product.count(query);
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
