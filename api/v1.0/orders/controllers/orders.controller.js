'use strict';
/**
 * Module dependencies.
 */
import OrdersService from '../services/orders.services';
import StatusesService from '../services/statuses.services';
import AddressesService from '../../addresses/services/addresses.services';
import PaymentsService from '../../payments/services/payments.services';
import FeedbacksService from '../../feedbacks/services/feedbacks.services';
import CartsService from '../../carts/services/carts.services';
import mongoose from "mongoose";
import moment from "moment";

import { generateOrderID, getPreSignedURL, formatAddress, getProductsList } from "../../../../common/utils";
import { response } from 'express';

const objectId = mongoose.Types.ObjectId;

const add = (req, res) => {
  let { body, database } = req;

  let { userID } = req.decoded;
  let { paymentStatus, transactionID, paidAmount, paymentType } = body;

  let paymentData = {
    userID,
    priceDetails: body.priceDetails,
    totalAmount: body.totalAmount,
    transactionID: transactionID,
    status: paymentStatus,
    paymentType: paymentType
  }

  let address, products = [], paymentID;

  PaymentsService.create(database, paymentData)
    .then((response) => {
      paymentID = response._id;
      return AddressesService.findOne(database, {_id: objectId(body.addressID)})
    })
    .then((response) => {
      address = response;
      return CartsService.findOne(database, {userID: objectId(userID)})
    })
    .then((response) => {
      products = response.products;
      products.forEach((product) => {
        if(product.delivery && !product.delivery.deliverType) {
          product.delivery.startDate = undefined;
          product.delivery.endDate = undefined;
        }
      })
      response.products = [];
      response.save();
      let order = {
        orderID: generateOrderID(6),
        userID,
        products,
        address,
        paymentID,
        paymentStatus,
        transactionID,
        paidAmount,
        paymentType,
        // statuses: [{
        //   status: 'Order Placed',
        //   createdAt: new Date(),
        //   createdBy: userID
        // }]
        status: 'placed'
      }
      return OrdersService.create(database, order);
    })
    .then((response) => {
      return PaymentsService.update(database, {_id: paymentID}, {orderID: response._id});
    })
    .then((response) => {
      res.status(200).json({ success: true, message: "Order placed successfully" });
    })
    .catch((error) => {
      console.log(error)
      res.status(400).json({ success: false, message: "Internal Server error. Please try after sometime." });
    })
};

const update = (req, res) => {
  let { body, database } = req;
  let { orderID } = req.params;
  OrdersService.update(database, { _id: objectId(orderID) }, body)
    .then((response) => {
      if (response) {
        res.status(200).json({ success: true, message: "Order udpated successfully", data: response });
      } else {
        res.status(400).json({ success: false, message: "Error in updating Order." });
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
  let { orderID } = req.params;

  OrdersService.update(database, { _id: objectId(orderID) }, {isDeleted: true})
    .then((response) => {
      if (response) {
        res.status(200).json({ success: true, message: "Order deleted successfully" });
      } else {
        res.status(400).json({ success: false, message: "Error in deleting Order." });
      }
    })
    .catch((error) => {
      res.status(400).json({ success: false, message: "Internal Server error. Please try after sometime." });
    })
};

const list = (req, res) => {
  let { database } = req;
  let { userID, userType } = req.decoded;

  let { type } = req.params;

  let query = {isDeleted: false};
  if(userType == 'customer') {
    query.userID = objectId(userID);
  }

  if(type)
    query.status = type;

  let selectables = '';
  OrdersService.find(database, query, selectables)
    .then((response) => {
      if (response) {
        let orders = [];
        response.forEach((order) => {
          order = order.toObject();
          order.address = formatAddress(order.address);
          let products = getProductsList(order.products);
          products.forEach((product) => {
            product.product = product.productID;
            product.productID = product.productID._id;
            if(product.product && product.product.imageKey)
              product.product.imageUrl = getPreSignedURL(product.product.imageKey);
            if(product.delivery && !product.delivery.deliverType) {
              product.delivery.startDate = undefined;
              product.delivery.endDate = undefined;
            }
          })
          order.products = products;
          if (order.products.length)
            orders.push(order);
        })
        res.status(200).json({ success: true, message: "Orders loaded successfully", data: orders });
      } else {
        res.status(400).json({ success: false, message: "Error in loading Orders" });
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(400).json({ success: false, message: "Error in loading Orders" });
    })
}

const getOne = (req, res) => {
  let { database } = req;
  let { orderID } = req.params;

  let { userID } = req.decoded;

  let selectables = '', order;
  OrdersService.getOne(database, {_id: objectId(orderID)}, selectables)
    .then((response) => {
      if (response) {
        response = response.toObject();
        response.statuses = [];
        if(response.address)
          response.address = formatAddress(response.address)
        
        response.products.forEach((product) => {
          let delivery = product.delivery;
          product.product = product.productID;
          product.productID = product.productID._id;
          product.delivery = delivery;
          if(product.product && product.product.imageKey)
              product.product.imageUrl = getPreSignedURL(product.product.imageKey);
        })

        order = response;
        let currentDate = new Date();
        let query = {
          "deliveryDate.day": currentDate.getDate(),
          "deliveryDate.month": currentDate.getMonth() + 1,
          "deliveryDate.year": currentDate.getFullYear(),
          orderID: order._id
        }

        return StatusesService.findOne(database, query)
        .then((response) => {
          if(response)
            return response;
          else {
            query.userID = order.userID;
            query.statuses = [{
              status: "placed",
              createdBy: order.userID
            }]
            return StatusesService.create(database, query)
          }
        })
      } else {
        throw {
          reason: 'NOT_FOUND'
        }
      }
    })
    .then((response) => {
      order.statuses = statusFormatted(response.statuses);
      return FeedbacksService.findOne(database, {userID: order.userID, orderID: order._id});
    })
    .then((response) => {
      order.feedback = (response)?true:false;
      res.status(200).json({ success: true, message: "Order loaded successfully", data: order });
    })
    .catch((error) => {
      console.log(error)
      if(error.reason == 'NOT_FOUND')
      res.status(400).json({ success: false, message: "Order not found with the given details." });
      else
      res.status(400).json({ success: false, message: "Error in loading Order" });
    })
}

const addStatus = (req, res) => {
  let { body, database } = req;
  let { orderID } = req.body;
  let { userID } = req.decoded;

  console.log(req.body);
  let order, currentDate = new Date();
  OrdersService.simpleGetOne(database, { _id: objectId(orderID) })
    .then((response) => {
      if (response) {
        order = response;
        response.status = body.status;
        response.save();

        return StatusesService.findOne(database, {
          "deliveryDate.day": currentDate.getDate(),
          "deliveryDate.month": currentDate.getMonth() + 1,
          "deliveryDate.year": currentDate.getFullYear(),
          orderID: objectId(orderID),
        });
      } else {
        throw {
          reason: "NOT_FOUND",
        };
      }
    })
    .then((response) => {
      if (response) {
        response.statuses.push({
          status: body.status.toLowerCase(),
          createdAt: new Date(),
          createdBy: userID,
        });
        response.status = body.status;
        return response.save();
      } else {
        let query = {
          "deliveryDate.day": currentDate.getDate(),
          "deliveryDate.month": currentDate.getMonth() + 1,
          "deliveryDate.year": currentDate.getFullYear(),
          userID: userID,
          orderID: orderID,
        };
        query.statuses = [
          {
            status: "placed",
            createdAt: order.createdAt,
            createdBy: order.userID,
          },
          {
            status: body.status,
            createdBy: order.userID,
          },
        ];
        console.log(query);
        return StatusesService.create(database, query);
      }
    })
    .then((response) => {
      res.status(200).json({ success: true, message: "Order Status updated successfully" });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(400)
        .json({ success: false, message: "Error in updating Order" });
    });
}

function statusFormatted(status) {
  let statuses = [];
  status.forEach((stat) => {
    statuses.push({
      _id: stat._id,
      status: stat.status,
      createdAt: stat.createdAt
    })
  })
  return statuses;
}

export default {
  add,
  list,
  update,
  remove,
  getOne,
  addStatus
};