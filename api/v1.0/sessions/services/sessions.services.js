"use strict";

import md5 from "md5";
import schema from "../models/sessions.model";

const findOne = (db, values, selectables) => {
  var Session = db.model("sessions", schema);
  return Session.findOne(values).select(selectables).exec();
};

const find = (db, values, selectables) => {
  var Session = db.model("sessions", schema);
  return Session.find(values)
    .select(selectables)
    .exec();
};

const create = (db, values) => {
  var Session = db.model("sessions", schema);
  return Session.create(values);
};

const insertMany = (db, values) => {
  var Session = db.model("sessions", schema);
  return Session.insertMany(values);
};

const findOneAndUpdate = (db, query, data) => {
  var Session = db.model("sessions", schema);
  return Session.findOneAndUpdate(query, data, { new: true }).exec();
};

const get = (db, values) => {
  var Session = db.model("sessions", schema);
  return Session.find(values).exec();
};

const update = (db, query, values) => {
  var Session = db.model("sessions", schema);
  return Session.update(query, values, {multi: true}).exec();
};

const count = (db, query) => {
  var Session = db.model("sessions", schema);
  return Session.count(query);
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