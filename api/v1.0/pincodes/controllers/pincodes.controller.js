'use strict';
/**
 * Module dependencies.
 */
import pincodesService from '../services/pincodes.services.js';
import mongoose from "mongoose";

import config from '../../../../config/config';

const objectId = mongoose.Types.ObjectId;

const add = (req, res) => {
  let { body, database } = req;
  pincodesService.create(database, body)
  .then((response) => {
    if(response) {
      res.status(200).json({success: true, message: "pincode added successfully", data: response});
    } else {
      res.status(400).json({success: false, message: "Error in adding pincode"});
    }
  })
  .catch((error) => {
    res.status(400).json({success: false, message: "Error in pincode add"});
  })
};

const update = (req, res) => {
  let { body, database } = req;
  let { pincodeID } = req.params;

  pincodesService.update(database, {_id: objectId(pincodeID)}, body)
    .then((response) => {
      if (response) {
        res.status(200).json({ success: true, message: "Pincode udpated successfully", data: response });
      } else {
        res.status(400).json({ success: false, message: "Error in updating Pincode." });
      }
    })
    .catch((error) => {
      if (error.code == 11000)
        res.status(400).json({ success: false, message: "Pincode already exists in the database." });
      else
        res.status(400).json({ success: false, message: "Internal Server error. Please try after sometime." });
    })
};

const remove = (req, res) => {
  let { body, database } = req;
  let { pincodeID } = req.params;

  pincodesService.update(database, {_id: objectId(pincodeID)}, {isDeleted: true})
    .then((response) => {
      if (response) {
        res.status(200).json({ success: true, message: "Pincode deleted successfully" });
      } else {
        res.status(400).json({ success: false, message: "Error in deleting Pincode." });
      }
    })
    .catch((error) => {
        res.status(400).json({ success: false, message: "Internal Server error. Please try after sometime." });
    })
};

const list = (req, res) => {
  let { database } = req;
  let { stateID, cityID } = req.params;
  let selectables = 'pincode';
  pincodesService.find(database, {isDeleted: false, stateID: objectId(stateID), cityID: objectId(cityID)}, selectables)
  .then((response) => {
    res.status(200).json({success: true, message: "Pincodes loaded successfully", data: response});
  })
  .catch((error) => {
    res.status(400).json({success: false, message: "Error in loading pincodes"});
  })
}

export default {
  add,
  list,
  update,
  remove
};
