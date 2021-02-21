'use strict';
/**
 * Module dependencies.
 */
import MerchantService from '../services/merchants.services.js';

import emailValidator from "email-validator";
import mongoose from "mongoose";
import md5 from 'md5';

import {
  generateJwtToken, getPreSignedURL
} from "../../../../common/utils";

import config from '../../../../config/config';

import { getDatabaseConnection, addMerchant, updateMerchant } from '../../../../config/connections';

import { merchants } from "../../../../config/constants";

const objectId = mongoose.Types.ObjectId;

const add = (req, res) => {

  if (req.body.email)
    req.body.email = req.body.email.toLowerCase();

  if (!req.body.username)
    req.body.username = req.body.email;

  MerchantService.findOne({ username: req.body.username })
    .then((response) => {
      if (response) {
        throw {
          reason: "Already_Exists"
        };
      } else {
        let body = req.body;
        body.licenseKey = randomString(64);
        body.accessKey = randomString(32);
        return MerchantService.create(body);
      }
    })
    .then((response) => {
      addMerchant({ licenseKey: response.licenseKey, accessKey: response.accessKey, merchantID: response._id, database: response.database, storageFolder: response.storageFolder })
      getDatabaseConnection(response.licenseKey, response.accessKey);
      res.status(200).json({ success: true, message: "Merchant added successfully", data: response });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ success: false, message: "Already exists" });
    });
};

const list = (req, res) => {
  let query = {};
  MerchantService.find(query)
    .then((response) => {
      let merchants = [];
      response.forEach((merchant) => {
        merchant = merchant.toObject();
        merchant.merchantLogoUrl = getPreSignedURL(merchant.merchantLogoKey);
        merchants.push(merchant)
      })
      res.status(200).json({ success: true, message: "Merchants loaded successfully", data: merchants });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: "Internal Server error. Please try after sometime." });
    });
}

const getDetails = (req, res) => {
  let { userType } = req.decoded;
  let { merchantID } = req.params;
  let query = { _id: objectId(merchantID) };
  let selectables = '-password -database -storageFolder -accessKey -licenseKey -active -gcmKey -permissions';
  if(userType == 'superadmin')
    selectables = '-password -accessKey -licenseKey -active -gcmKey -permissions'
  MerchantService.findOne(query, )
    .then((response) => {
      if(response && response.merchantLogoKey) {
        response = response.toObject();
        response.merchantLogoUrl = getPreSignedURL(response.merchantLogoKey);
      }
      res.status(200).json({ success: true, message: "Merchant loaded successfully", data: response });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: "Internal Server error. Please try after sometime." });
    });
}

const update = (req, res) => {
  let { merchantID } = req.params;
  let query = { _id: objectId(merchantID) };
  if (req.body.email)
    req.body.email = req.body.email.toLowerCase();
  if(req.body.database)
    delete req.body.database;
  if(req.body.storageFolder)
    delete req.body.storageFolder;
  if(req.body.licenseKey)
    delete req.body.licenseKey;
  if(req.body.accessKey)
    delete req.body.accessKey;

  MerchantService.update(query, req.body)
    .then((response) => {

      updateMerchant(merchantID, response);
      if (req.body && req.body.password)
        return SessionsService.remove({ userID: merchantID });
      else
        return;

    })
    .then((response) => {
      res.status(200).json({ success: true, message: "Merchant updated successfully" });
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ success: false, message: "Internal Server error. Please try after sometime." });
    });
}

const validate = (req, res) => {
  let selectables = 'accessKey licenseKey'
  MerchantService.findOne({ code: req.body.code }, selectables)
    .then((response) => {
      console.log(response)
      let token = '';
      if(response) {
        token = generateJwtToken(response)
        res.status(200).json({ success: true, message: "Merchant validated successfully", data: token });
      } else {
        res.status(200).json({ success: false, message: "Invalid Code. Please try again with Valid Code." });
      }
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: "Internal Server error. Please try after sometime." });
    });
}

function randomString(len) {
  let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

export default {
  add,
  list,
  getDetails,
  update,
  validate
};
