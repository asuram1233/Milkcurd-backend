'use strict';

import _ from 'lodash';
import md5 from 'md5';
import Merchant from '../models/merchants.model';

const findOne = (values, selectables) => {
  if (values.password)
    values.password = md5(values.password);
  return Merchant.findOne(values).select(selectables).exec();
};

const find = (values) => {
  return Merchant.find(values).select('-password').exec();
};

const create = (values) => {
  return Merchant.create(values);
};

const update = (query, data) => {
  if (data.password)
    data.password = md5(data.password)
  return Merchant.findOneAndUpdate(query, { $set: data }, { new: true }).exec();
};


module.exports = {
  findOne,
  create,
  find,
  update
};
