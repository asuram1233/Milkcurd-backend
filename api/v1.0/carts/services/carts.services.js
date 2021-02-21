"use strict";

import md5 from "md5";
import schema from "../models/carts.model";
import productsSchema from "../../products/models/products.model";

const findOne = (db, values, selectables) => {
  var Cart = db.model("carts", schema);
  return Cart.findOne(values).select(selectables).exec();
};

const findOneAndPopulate = (db, values, selectables) => {
  var Cart = db.model("carts", schema);
  db.model("products", productsSchema);
  return Cart.findOne(values).populate("products.productID","-createdAt -updatedAt -createdBy -__v -carouselImageKeys -isActive -isDeleted").select(selectables).exec();
};

const find = (db, values, selectables) => {
  var Cart = db.model("carts", schema);
  return Cart.find(values)
    .select(selectables)
    .exec();
};

const create = (db, values) => {
  var Cart = db.model("carts", schema);
  return Cart.create(values);
};

const insertMany = (db, values) => {
  var Cart = db.model("carts", schema);
  return Cart.insertMany(values);
};

const findOneAndUpdate = (db, query, data) => {
  var Cart = db.model("carts", schema);
  return Cart.findOneAndUpdate(query, data, { new: true }).exec();
};

const get = (db, values) => {
  var Cart = db.model("carts", schema);
  return Cart.find(values).exec();
};

const update = (db, query, values) => {
  var Cart = db.model("carts", schema);
  return Cart.update(query, values, {multi: true}).exec();
};

const count = (db, query) => {
  var Cart = db.model("carts", schema);
  return Cart.count(query);
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
  findOneAndPopulate
};
