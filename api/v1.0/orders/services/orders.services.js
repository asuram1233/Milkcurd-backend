"use strict";

import md5 from "md5";
import schema from "../models/orders.model";
import paymentsSchema from "../../payments/models/payments.model";
import usersSchema from "../../users/models/users.model";
import statesSchema from "../../states/models/states.model";
import citiesSchema from "../../cities/models/cities.model";
import pincodesSchema from "../../pincodes/models/pincodes.model";
import productsSchema from "../../products/models/products.model";

const findOne = (db, values, selectables) => {
  var Order = db.model("orders", schema);
  db.model("states", statesSchema);
  db.model("cities", citiesSchema);
  db.model("pincodes", pincodesSchema);
  return Order.findOne(values)
    .populate('address.stateID', 'name')
    .populate('address.cityID', 'name')
    .populate('address.pincodeID', 'pincode')
    .select(selectables).exec();
};

const find = (db, values, selectables) => {
  var Order = db.model("orders", schema);
  db.model("states", statesSchema);
  db.model("cities", citiesSchema);
  db.model("pincodes", pincodesSchema);
  db.model("products", productsSchema);
  return Order.find(values)
    .populate('address.stateID', 'name')
    .populate('address.cityID', 'name')
    .populate('address.pincodeID', 'pincode')
    .populate('products.productID', '')
    .select(selectables)
    .sort('-createdAt')
    .exec();
};

const create = (db, values) => {
  var Order = db.model("orders", schema);
  return Order.create(values);
};

const insertMany = (db, values) => {
  var Order = db.model("orders", schema);
  return Order.insertMany(values);
};

const findOneAndUpdate = (db, query, data) => {
  var Order = db.model("orders", schema);
  return Order.findOneAndUpdate(query, data, { new: true }).exec();
};

const get = (db, values) => {
  var Order = db.model("orders", schema);
  return Order.find(values).exec();
};

const getOne = (db, values) => {
  var Order = db.model("orders", schema);
  db.model("payments", paymentsSchema);
  db.model("users", usersSchema);
  db.model("products", productsSchema);
  db.model("states", statesSchema);
  db.model("cities", citiesSchema);
  db.model("pincodes", pincodesSchema);
  return Order.findOne(values)
  .populate('address.stateID', 'name')
  .populate('address.cityID', 'name')
  .populate('address.pincodeID', 'pincode')
  .populate('paymentID', 'totalAmount')
  .populate('products.productID', '')
  .populate('deliveryPersonID', 'firstName lastName mobile').exec();
};

const update = (db, query, values) => {
  var Order = db.model("orders", schema);
  return Order.update(query, values, {multi: true}).exec();
};

const count = (db, query) => {
  var Order = db.model("orders", schema);
  return Order.count(query);
};

const simpleGetOne = (db, values) => {
  var Order = db.model("orders", schema);
  return Order.findOne(values).exec();
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
  getOne,
  simpleGetOne,
};
