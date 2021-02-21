'use strict';
/**
 * Module dependencies.
 */
import ProductsService from '../services/products.services';
import mongoose from "mongoose";
import moment from "moment";

import { getPreSignedURL, getOffPercentage } from "../../../../common/utils";

const objectId = mongoose.Types.ObjectId;

const add = (req, res) => {
  let { body, database } = req;
  let { userID } = req.decoded;
  body.createdBy = userID;

  ProductsService.findOne(database, {name: body.name, categoryID: objectId(body.categoryID), isDeleted: false})
  .then((response) => {
    if(response)
      throw {
        reason: 'ALREADY_EXISTS'
      }
    else 
      return ProductsService.create(database, body)
  })
  .then((response) => {
    if (response) {
      res.status(200).json({ success: true, message: "Product added successfully" });
    } else {
      res.status(400).json({ success: false, message: "Error in adding Product." });
    }
  })
  .catch((error) => {
    if (error.reason == 'ALREADY_EXISTS')
      res.status(400).json({ success: false, message: "Product already exists." });
    else
      res.status(400).json({ success: false, message: "Internal Server error. Please try after sometime." });
  })
};

const update = (req, res) => {
  let { body, database } = req;
  let { productID } = req.params;
  ProductsService.update(database, { _id: objectId(productID) }, body)
  .then((response) => {
    if (response) {
      res.status(200).json({ success: true, message: "Product udpated successfully", data: response });
    } else {
      res.status(400).json({ success: false, message: "Error in updating Product." });
    }
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
  let { productID } = req.params;

  ProductsService.update(database, { _id: objectId(productID) }, {isDeleted: true})
    .then((response) => {
      if (response) {
        res.status(200).json({ success: true, message: "Product deleted successfully" });
      } else {
        res.status(400).json({ success: false, message: "Error in deleting Product." });
      }
    })
    .catch((error) => {
      res.status(400).json({ success: false, message: "Internal Server error. Please try after sometime." });
    })
};

const list = (req, res) => {
  let { database } = req;
  let { userID } = req.decoded;

  let { categoryID } = req.params;

  let query = {isDeleted: false};
  if(categoryID)
    query.categoryID = objectId(categoryID);

  let selectables = 'categoryID name caption imageKey description carouselImageKeys units measurement actualPrice currentPrice status quantity isActive';
  ProductsService.find(database, query, selectables)
    .then((response) => {
      if (response) {
        let data = [];
        response.forEach((item) => {
          item = item.toObject();
          item.off = (item.actualPrice && item.currentPrice)?getOffPercentage(item.actualPrice, item.currentPrice)+"%":0;
          item.imageUrl = getPreSignedURL(item.imageKey);
          let carouselImages = [];

          item.carouselImageKeys.forEach((carousel) => {
            carousel.imageUrl = getPreSignedURL(carousel.imageKey);
            carouselImages.push(carousel);
          });

          item.carouselImages = carouselImages;
          data.push(item);
        })
        res.status(200).json({ success: true, message: "Products loaded successfully", data: data });
      } else {
        res.status(400).json({ success: false, message: "Error in loading Products" });
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(400).json({ success: false, message: "Error in loading Products" });
    })
}

const getOne = (req, res) => {
  let { database } = req;
  let { productID } = req.params;

  let selectables = 'categoryID name caption imageKey description carouselImageKeys units measurement actualPrice currentPrice status quantity';
  ProductsService.findOne(database, {_id: objectId(productID)}, selectables)
    .then((response) => {
      if (response) {
        response = response.toObject();
        
        response.off = (response.actualPrice && response.currentPrice)?getOffPercentage(response.actualPrice, response.currentPrice)+"%":0;
        response.imageUrl = getPreSignedURL(response.imageKey);
        let carouselImages = [];

        response.carouselImageKeys.forEach((carousel) => {
          carousel.imageUrl = getPreSignedURL(carousel.imageKey);
          if(carousel.isActive)
            carouselImages.push(carousel);
        });

        response.carouselImages = carouselImages;
        res.status(200).json({ success: true, message: "Product loaded successfully", data: response });
      } else {
        res.status(400).json({ success: false, message: "Error in loading Product" });
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(400).json({ success: false, message: "Error in loading Product" });
    })
}

export default {
  add,
  list,
  update,
  remove,
  getOne
};