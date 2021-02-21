'use strict';
/**
 * Module dependencies.
 */
import CartsService from '../services/carts.services';
import mongoose from "mongoose";
import moment from "moment";

import { getPreSignedURL } from "../../../../common/utils";

const objectId = mongoose.Types.ObjectId;

const add = (req, res) => {
  let { body, database } = req;
  let { userID } = req.decoded;

  CartsService.findOne(database, {userID: objectId(userID)})
  .then((response) => {
    if (response) {
      let exists = false, index;
      response.products.forEach((product, i) => {
        if(product.productID == body.productID) {
          exists = true;
          index = i
        }
      })
      if(!exists)
        response.products.push(body)
      else {
        response.products[index].quantity+=body.quantity;
        response.products[index].delivery = body.delivery;
        response.products[index].units = body.units;
        response.products[index].measurement = body.measurement;
      }

      return response.save();
    } else {
      let data = {
        userID: userID,
        products: [body]
      }
      return CartsService.create(database, data);
    }
  })
  .then((response) => {
    res.status(200).json({ success: true, message: "Product successfully added to cart" });
  })
  .catch((error) => {
    console.log(error)
    res.status(400).json({ success: false, message: "Internal Server error. Please try after sometime." });
  })
};

const update = (req, res) => {
  let { body, database } = req;
  let { userID } = req.decoded;
  let { productID } = req.params;
  CartsService.findOne(database, { userID: objectId(userID) })
    .then((response) => {
      if (response) {
        response.products.forEach((product) => {
          if(product.productID == productID) {
            let { quantity, units, measurement, delivery } = body;
            if(quantity)
              product.quantity = quantity;
            if(units)
              product.units = units;
            if(measurement)
              product.measurement = measurement;
            if(delivery)
              product.delivery = delivery;
          }
        })
        response.save();
        res.status(200).json({ success: true, message: "Cart udpated successfully" });
      } else {
        res.status(400).json({ success: false, message: "Error in updating Cart." });
      }
    })
    .catch((error) => {
      res.status(400).json({ success: false, message: "Internal Server error. Please try after sometime." });
    })
};

const remove = (req, res) => {
  let { body, database } = req;
  let { productID } = req.params;
  let { userID } = req.decoded;

  CartsService.findOne(database, { userID: objectId(userID) })
    .then((response) => {
      if (response) {
        let products = [];
        response.products.forEach((product) => {
          if(product.productID != productID)
            products.push(product);
        })
        response.products = products;
        return response.save();
      }
    })
    .then((response) => {
      res.status(200).json({ success: true, message: "Product deleted from cart successfully" });
    })
    .catch((error) => {
      res.status(400).json({ success: false, message: "Internal Server error. Please try after sometime." });
    })
};

const getOne = (req, res) => {
  let { database } = req;
  let { userID } = req.decoded;

  let selectables = '-createdAt -updatedAt -createdBy -__v -isActive -isDeleted';
  CartsService.findOneAndPopulate(database, {userID: objectId(userID)}, selectables)
    .then((response) => {
      if (response) {
        let subTotal = 0, deliveryAmount = response.products.length?10:0, sgst = 0, cgst = 0, grandTotal = 0;
        response = response.toObject();
        response.hasSubscriptionItem = false;
        response.products.forEach((product) => {
          let delivery = product.delivery;
          product.product = product.productID;
          product.productID = product.product._id;
          if (delivery.deliverType != 'Instant') {
            response.hasSubscriptionItem = true;
          }
          product.product.delivery = undefined;
          product.total = product.quantity * product.product.currentPrice;
          subTotal+= product.quantity * product.product.currentPrice;
          if(product.product && product.product.imageKey) {
            product.product.imageUrl = getPreSignedURL(product.product.imageKey)
          }
        })
        
        let priceDetails = [{
          name: 'Number of Items',
          value: response.products.length
        }, {
          name: 'Sub Total',
          value: subTotal
        }, {
          name: 'Delivery Charges',
          value: deliveryAmount
        }, {
          name: 'SGST',
          value: sgst
        }, {
          name: 'CGST',
          value: cgst
        }, {
          name: 'Grand Total',
          value: subTotal+deliveryAmount+sgst+cgst
        }];

        response.priceDetails = priceDetails;

        res.status(200).json({ success: true, message: "Cart loaded successfully", data: response });
      } else {
        res.status(200).json({ success: true, message: "Cart loaded successfully" });
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(400).json({ success: false, message: "Error in loading Cart" });
    })
}

const getCount = (req, res) => {
  let { database } = req;
  let { userID } = req.decoded;

  let selectables = '';
  CartsService.findOne(database, {userID: objectId(userID)}, selectables)
    .then((response) => {
        res.status(200).json({ success: true, message: "Cart items count loaded successfully", data: (response && response.products)?response.products.length:0});
    })
    .catch((error) => {
      console.log(error)
      res.status(400).json({ success: false, message: "Error in loading Cart" });
    })
}

export default {
  add,
  update,
  remove,
  getOne,
  getCount
};