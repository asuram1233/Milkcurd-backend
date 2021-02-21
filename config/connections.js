import mongoose from "mongoose";

import MerchantService from '../api/v1.0/merchants/services/merchants.services.js';

import { merchants } from "./constants";
import config from "./config";

//Object holding all your connection strings
var connections = {};

function loadDefaultDatabases() {
  MerchantService.find({})
    .then((response) => {
      response.forEach((merchant) => {
        merchants.push({
          merchantID: merchant._id, email: merchant.email, name: merchant.name, licenseKey: merchant.licenseKey, accessKey: merchant.accessKey, database: merchant.database, isActive: merchant.isActive, storageFolder: merchant.storageFolder,
          gcmKey: merchant.gcmKey,
          otpURL: merchant.otpURL,
          transactionURL: merchant.transactionURL,
          promotionalURL: merchant.promotionalURL
        });
        connections["" + merchant.database] = mongoose.createConnection(config.default.db.mongodb.uri + merchant.database);
      });
    });
}

loadDefaultDatabases();

exports.getDatabaseConnection = function (licenseKey, accessKey, merchantID) {

  // console.log(licenseKey, accessKey, merchantID)
  let database = "", isActive;
  merchants.forEach((merchant) => {
    if ((merchant.licenseKey === licenseKey) && (merchant.accessKey === accessKey)) {
      database = merchant.database;
      isActive = merchant.isActive;
    } else if ("" + merchant.merchantID == "" + merchantID) {
      database = merchant.database;
      isActive = merchant.isActive;
    }
  });

  console.log(database)

  if (database && isActive) {
    if (connections['' + database]) {
      return connections['' + database];
    } else {
      connections['' + database] = mongoose.createConnection(config.default.db.mongodb.uri + database);
      return connections['' + database];
    }
  } else {
    return;
  }
}

exports.getGCMKey = function (licenseKey, accessKey, merchantID) {

  let gcmKey = "";
  merchants.forEach((merchant) => {
    if ((merchant.licenseKey === licenseKey) && (merchant.accessKey === accessKey)) {
      gcmKey = merchant.gcmKey;
    } else if ("" + merchant.merchantID == "" + merchantID) {
      gcmKey = merchant.gcmKey;
    }
  })
  return gcmKey;
}

exports.addMerchant = function (data) {
  merchants.push(data);
}

exports.updateMerchant = function (merchantID, data) {
  merchants.forEach((merchant) => {
    if (merchant.merchantID == merchantID) {
      merchant.isActive = data.isActive;
      merchant.gcmKey = data.gcmKey;
      merchant.name = data.name;
      merchant.email = data.email;
      merchant.name = data.name;
      merchant.otpURL = data.otpURL,
      merchant.transactionURL = data.transactionURL;
      merchant.promotionalURL= data.promotionalURL;
    }
  })
}

exports.getMerchant = function (licenseKey, accessKey) {
  let merchant;
  merchants.forEach((m) => {
    if ((m.licenseKey === licenseKey) && (m.accessKey === accessKey)) {
      merchant = m;
    }
  })
  return merchant;
}

exports.getMerchantByID = function (merchantID) {
  let merchant;
  merchants.forEach((m) => {
    if ((m.merchantID == merchantID)) {
      merchant = m;
    }
  })
  return merchant;
}

exports.getMerchantID = function (licenseKey, accessKey) {

  let merchantID = "";
  merchants.forEach((merchant) => {
    if ((merchant.licenseKey === licenseKey) && (merchant.accessKey === accessKey)) {
      merchantID = merchant._id;
    }
  })
  return merchantID;
}
