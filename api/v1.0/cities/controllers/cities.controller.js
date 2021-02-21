'use strict';
/**
 * Module dependencies.
 */
import citiesService from '../services/cities.services.js';
import mongoose from "mongoose";

import config from '../../../../config/config';

const objectId = mongoose.Types.ObjectId;

const add = (req, res) => {
  let { body, database } = req;
  citiesService.create(database, body)
  .then((response) => {
    if(response) {
      res.status(200).json({success: true, message: "city added successfully", data: response});
    } else {
      res.status(400).json({success: false, message: "Error in adding city"});
    }
  })
  .catch((error) => {
    res.status(400).json({success: false, message: "Error in city add"});
  })
};

const update = (req, res) => {
  let { body, database } = req;
  let { cityID } = req.params;

  citiesService.update(database, {_id: objectId(cityID)}, body)
    .then((response) => {
      if (response) {
        res.status(200).json({ success: true, message: "City udpated successfully", data: response });
      } else {
        res.status(400).json({ success: false, message: "Error in updating City." });
      }
    })
    .catch((error) => {
      if (error.code == 11000)
        res.status(400).json({ success: false, message: "City already exists in the database." });
      else
        res.status(400).json({ success: false, message: "Internal Server error. Please try after sometime." });
    })
};

const remove = (req, res) => {
  let { body, database } = req;
  let { cityID } = req.params;

  citiesService.update(database, {_id: objectId(cityID)}, {isDeleted: true})
    .then((response) => {
      if (response) {
        res.status(200).json({ success: true, message: "City deleted successfully" });
      } else {
        res.status(400).json({ success: false, message: "Error in deleting City." });
      }
    })
    .catch((error) => {
        res.status(400).json({ success: false, message: "Internal Server error. Please try after sometime." });
    })
};

const list = (req, res) => {
  let { database } = req;
  let { stateID } = req.params;
  let selectables = 'name';
  citiesService.find(database, {isDeleted: false, stateID: objectId(stateID)}, selectables)
  .then((response) => {
    res.status(200).json({success: true, message: "Cities loaded successfully", data: response});
  })
  .catch((error) => {
    res.status(400).json({success: false, message: "Error in loading cities"});
  })
}

export default {
  add,
  list,
  update,
  remove
};
