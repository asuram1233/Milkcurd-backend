'use strict';
/**
 * Module dependencies.
 */
import FeedbacksService from '../services/feedbacks.services.js';
import mongoose from "mongoose";
import { getPreSignedURL } from '../../../../common/utils.js';

const objectId = mongoose.Types.ObjectId;

const add = (req, res) => {

  let { body, database } = req;

  let { userID } = req.decoded;
  req.body.userID = userID;
  FeedbacksService.create(database, req.body)
    .then((response) => {
      res.status(200).json({ success: true, message: "Feedback added successfully", feedback: true });
    })
    .catch((error) => {
      res.status(400).json({ success: false, message: "Internal server error. Please try after sometime." });
    });
};

const list = (req, res) => {
  let { body, database } = req;

  let { userID, userType } = req.decoded;

  let { orderID } = req.params;

  let query = {};

  if(userType == 'customer') {
    query.userID = objectId(userID)
  }

  if(orderID) {
    query.orderID = objectId(orderID)
  }
  
  FeedbacksService.findAndPopulate(database, query)
    .then((response) => {
      let feedbacks = [];
      response.forEach((f) => {
        f = f.toObject();
        f.user = f.userID;
        f.userID = f.user._id;
        f.user.profilePicUrl = (f.user && f.user.profilePicKey)?getPreSignedURL(f.user.profilePicKey):"";
        let {_id, feedback, rating, userID, orderID, createdAt, user } = f;
        feedbacks.push({_id, feedback, rating, orderID, userID, createdAt, user});
      })
      res.status(200).json({ success: true, message: "Feedbacks loaded successfully", data: feedbacks });
    })
    .catch((error) => {
      res.status(400).json({ success: false, message: "Internal server error. Please try after sometime." });
    });
}

export default {
  add,
  list
};
