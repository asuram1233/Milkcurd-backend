'use strict';
/**
 * Module dependencies.
 */
import statesService from '../services/states.services.js';
import mongoose from "mongoose";

import config from '../../../../config/config';

const objectId = mongoose.Types.ObjectId;

const add = (req, res) => {
  let { body, database } = req;
  statesService.create(database, body)
  .then((response) => {
    if(response) {
      res.status(200).json({success: true, message: "state added successfully", data: response});
    } else {
      res.status(400).json({success: false, message: "Error in adding state"});
    }
  })
  .catch((error) => {
    res.status(400).json({success: false, message: "Error in state add"});
  })
};

const update = (req, res) => {
  let { body, database } = req;
  let { stateID } = req.params;

  statesService.update(database, {_id: objectId(stateID)}, body)
    .then((response) => {
      if (response) {
        res.status(200).json({ success: true, message: "State udpated successfully", data: response });
      } else {
        res.status(400).json({ success: false, message: "Error in updating State." });
      }
    })
    .catch((error) => {
      if (error.code == 11000)
        res.status(400).json({ success: false, message: "State already exists in the database." });
      else
        res.status(400).json({ success: false, message: "Internal Server error. Please try after sometime." });
    })
};

const remove = (req, res) => {
  let { body, database } = req;
  let { stateID } = req.params;

  statesService.update(database, {_id: objectId(stateID)}, {isDeleted: true})
    .then((response) => {
      if (response) {
        res.status(200).json({ success: true, message: "State deleted successfully" });
      } else {
        res.status(400).json({ success: false, message: "Error in deleting State." });
      }
    })
    .catch((error) => {
        res.status(400).json({ success: false, message: "Internal Server error. Please try after sometime." });
    })
};

const list = (req, res) => {
  let { database } = req;
  let selectables = 'name ';
  statesService.find(database, {isDeleted: false}, selectables)
  .then((response) => {
    res.status(200).json({success: true, message: "States loaded successfully", data: response});
  })
  .catch((error) => {
    res.status(400).json({success: false, message: "Error in loading states"});
  })
}

export default {
  add,
  list,
  update,
  remove
};
