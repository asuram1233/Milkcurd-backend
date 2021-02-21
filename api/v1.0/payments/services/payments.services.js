"use strict";

import md5 from "md5";
import schema from "../models/payments.model";

const findOne = (db, values, selectables) => {
  var Payment = db.model("payments", schema);
  return Payment.findOne(values).select(selectables).exec();
};

const find = (db, values, selectables) => {
  var Payment = db.model("payments", schema);
  return Payment.find(values)
    .select(selectables)
    .exec();
};

const create = (db, values) => {
  var Payment = db.model("payments", schema);
  return Payment.create(values);
};

const insertMany = (db, values) => {
  var Payment = db.model("payments", schema);
  return Payment.insertMany(values);
};

const findOneAndUpdate = (db, query, data) => {
  var Payment = db.model("payments", schema);
  return Payment.findOneAndUpdate(query, data, { new: true }).exec();
};

const get = (db, values) => {
  var Payment = db.model("payments", schema);
  return Payment.find(values).exec();
};

const update = (db, query, values) => {
  var Payment = db.model("payments", schema);
  return Payment.update(query, values, {multi: true}).exec();
};

const count = (db, query) => {
  var Payment = db.model("payments", schema);
  return Payment.count(query);
};

const sum = (db, query) => {
  var Payment = db.model('payments', schema);
  return Payment.aggregate(
    [
      {
        $match: query
      },
      {
        $group: {
          _id: '$isActive',
          totalAmount: { $sum: "$totalAmount" }
        }
      },
      {
        $project: {
          _id: 1,
          "totalAmount": '$totalAmount'
        }
      }
    ]
  )
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
  sum
};
