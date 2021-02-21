'use strict';
/**
 * Module dependencies.
 */
import AddressesService from '../services/addresses.services';
import mongoose from "mongoose";
import moment from "moment";

import { formatAddress } from "../../../../common/utils";
const objectId = mongoose.Types.ObjectId;

const add = (req, res) => {
  let { body, database } = req;
  let { userID } = req.decoded;
  body.createdBy = userID;
  body.userID = userID;

  AddressesService.create(database, body)
  .then((response) => {
    if(body.default) {
      return AddressesService.update(database, { _id: {$ne: objectId(response._id) }}, {default: false});
    } else
      return;
  })
  .then((response) => {
    res.status(200).json({ success: true, message: "Address added successfully" });
  })
  .catch((error) => {
    res.status(400).json({ success: false, message: "Internal Server error. Please try after sometime." });
  })
};

const update = (req, res) => {
  let { body, database } = req;
  let { addressID } = req.params;
  AddressesService.update(database, { _id: objectId(addressID) }, body)
    .then((response) => {
      if(body.default) {
        return AddressesService.update(database, { _id: {$ne: objectId(addressID) }}, {default: false});
      } else
        return;
    })
    .then((response) => {
      res.status(200).json({ success: true, message: "Address udpated successfully" });
    })
    .catch((error) => {
      if (error.code == 11000)
        res.status(400).json({ success: false, message: "Year already exists in the database." });
      else
        res.status(400).json({ success: false, message: "Internal Server error. Please try after sometime." });
    })
};

const remove = (req, res) => {
  let { body, database } = req;
  let { addressID } = req.params;

  AddressesService.update(database, { _id: objectId(addressID) }, {isDeleted: true})
    .then((response) => {
      if (response) {
        res.status(200).json({ success: true, message: "Address deleted successfully" });
      } else {
        res.status(400).json({ success: false, message: "Error in deleting Address." });
      }
    })
    .catch((error) => {
      res.status(400).json({ success: false, message: "Internal Server error. Please try after sometime." });
    })
};

const list = (req, res) => {
  let { database } = req;
  let { userID } = req.decoded;

  let selectables = '';
  AddressesService.find(database, {userID: objectId(userID), isDeleted: false}, selectables)
    .then((response) => {
      if (response) {
        let addresses = [];
        response.forEach((address) => {
          address = address.toObject();
          address = formatAddress(address);
          addresses.push(address)
        })
        res.status(200).json({ success: true, message: "Addresses loaded successfully", data: addresses });
      } else {
        res.status(400).json({ success: false, message: "Error in loading Addresses" });
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(400).json({ success: false, message: "Error in loading Addresses" });
    })
}

const getOne = (req, res) => {
  let { database } = req;
  let { addressID } = req.params;

  let selectables = '';
  AddressesService.findOne(database, {_id: objectId(addressID)}, selectables)
    .then((response) => {
      if (response) {
        response = response.toObject();
        response = formatAddress(response);
        res.status(200).json({ success: true, message: "Address loaded successfully", data: response });
      } else {
        res.status(400).json({ success: false, message: "Error in loading Address" });
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(400).json({ success: false, message: "Error in loading Address" });
    })
}

export default {
  add,
  list,
  update,
  remove,
  getOne
};