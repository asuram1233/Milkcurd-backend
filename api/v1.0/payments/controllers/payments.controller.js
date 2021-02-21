'use strict';
/**
 * Module dependencies.
 */
import PaymentsService from '../services/payments.services';
import mongoose from "mongoose";
import moment from "moment";

import { getPreSignedURL } from "../../../../common/utils";

const objectId = mongoose.Types.ObjectId;

const add = (req, res) => {
  let { body, database } = req;
  let { userID } = req.decoded;
  body.createdBy = userID;
  PaymentsService.findOne(database, {name: body.name, isDeleted: false})
  .then((response) => {
    if(response)
      throw {
        reason: 'ALREADY_EXISTS'
      }
    else 
      return PaymentsService.create(database, body)
  })
  .then((response) => {
    if (response) {
      res.status(200).json({ success: true, message: "Payment added successfully" });
    } else {
      res.status(400).json({ success: false, message: "Error in adding Payment." });
    }
  })
  .catch((error) => {
    if (error.reason == 'ALREADY_EXISTS')
      res.status(400).json({ success: false, message: "Payment already exists." });
    else
      res.status(400).json({ success: false, message: "Internal Server error. Please try after sometime." });
  })
};

const update = (req, res) => {
  let { body, database } = req;
  let { categoryID } = req.params;
  PaymentsService.update(database, { _id: objectId(categoryID) }, body)
    .then((response) => {
      if (response) {
        res.status(200).json({ success: true, message: "Payment udpated successfully", data: response });
      } else {
        res.status(400).json({ success: false, message: "Error in updating Payment." });
      }
    })
    .catch((error) => {
      if (error.code == 11000)
        res.status(400).json({ success: false, message: "Year already exists in the database." });
      else
        res.status(400).json({ success: false, message: "Internal Server error. Please try after sometime." });
    })
};

const list = (req, res) => {
  let { database } = req;
  let { userID } = req.decoded;

  let selectables = 'name imageKey description';
  PaymentsService.find(database, {isDeleted: false}, selectables)
    .then((response) => {
      if (response) {
        let data = [];
        response.forEach((item) => {
          item = item.toObject();
          item.imageUrl = getPreSignedURL(item.imageKey)
          data.push(item)
        })
        res.status(200).json({ success: true, message: "Payments loaded successfully", data: data });
      } else {
        res.status(400).json({ success: false, message: "Error in loading Payments" });
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(400).json({ success: false, message: "Error in loading Payments" });
    })
}

const getOne = (req, res) => {
  let { database } = req;
  let { categoryID } = req.params;

  let selectables = 'name imageKey description';
  PaymentsService.findOne(database, {_id: objectId(categoryID)}, selectables)
    .then((response) => {
      if (response) {
        response = response.toObject();
        response.imageUrl = getPreSignedURL(response.imageKey)
        res.status(200).json({ success: true, message: "Payment loaded successfully", data: response });
      } else {
        res.status(400).json({ success: false, message: "Error in loading Payment" });
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(400).json({ success: false, message: "Error in loading Payment" });
    })
}

export default {
  add,
  list,
  update,
  getOne
};