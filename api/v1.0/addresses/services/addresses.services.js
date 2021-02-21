"use strict";

import md5 from "md5";
import schema from "../models/addresses.model";
import statesSchema from "../../states/models/states.model";
import citiesSchema from "../../cities/models/cities.model";
import pincodesSchema from "../../pincodes/models/pincodes.model";

const findOne = (db, values, selectables) => {
  var Address = db.model("addresses", schema);
  db.model("states", statesSchema);
  db.model("cities", citiesSchema);
  db.model("pincodes", pincodesSchema);
  return Address.findOne(values)
    .populate('stateID', 'name')
    .populate('cityID', 'name')
    .populate('pincodeID', 'pincode')
    .select(selectables).exec();
};

const find = (db, values, selectables) => {
  var Address = db.model("addresses", schema);
  db.model("states", statesSchema);
  db.model("cities", citiesSchema);
  db.model("pincodes", pincodesSchema);
  return Address.find(values)
    .populate('stateID', 'name')
    .populate('cityID', 'name')
    .populate('pincodeID', 'pincode')
    .select(selectables)
    .exec();
};

const create = (db, values) => {
  var Address = db.model("addresses", schema);
  return Address.create(values);
};

const insertMany = (db, values) => {
  var Address = db.model("addresses", schema);
  return Address.insertMany(values);
};

const findOneAndUpdate = (db, query, data) => {
  var Address = db.model("addresses", schema);
  return Address.findOneAndUpdate(query, data, { new: true }).exec();
};

const get = (db, values) => {
  var Address = db.model("addresses", schema);
  return Address.find(values).exec();
};

const update = (db, query, values) => {
  var Address = db.model("addresses", schema);
  return Address.update(query, values, {multi: true}).exec();
};

const count = (db, query) => {
  var Address = db.model("addresses", schema);
  return Address.count(query);
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
