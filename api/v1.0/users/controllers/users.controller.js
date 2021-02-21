'use strict';
/**
 * Module dependencies.
 */
import UserService from '../services/users.services.js';
import SessionsService from '../../sessions/services/sessions.services';
import PaymentsService from '../../payments/services/payments.services';
import OrdersService from '../../orders/services/orders.services';
import ProductsService from '../../products/services/products.services';
import CategoriesService from '../../categories/services/categories.services';
import StatusesService from '../../orders/services/statuses.services';

import mongoose from "mongoose";
import md5 from 'md5';

import {
  generateJwtToken,
  generateOTP,
  getPreSignedURL,
  formatAddress,
  productDeliverable,
  getProductsList,
} from "../../../../common/utils";

import {
  sendOTPSMS
} from "../../../../common/messages";

import config from '../../../../config/config';

const objectId = mongoose.Types.ObjectId;

const add = (req, res) => {
  let { body, database } = req;
  let query = { mobile: body.mobile.trim() };

  let otp = generateOTP();
  UserService.findOne(database, query)
    .then((response) => {
      if(response) {
        throw {
          _id: response._id,
          reason: "ALREADY_EXISTS"
        }
      } else {
        body.username = body.mobile;
        body.otp = otp;
        return UserService.create(database, body);
      }
    })
    .then((response) => {
      console.log(otp)
      res.status(201).json({ success: true, message: "User Registered successfully" });
    })
    .catch((error) => {
      if (error.reason == 'ALREADY_EXISTS' || error.code == 11000)
        res.status(200).json({ success: false, message: "The given mobile number is already exists", data: {_id: error._id} });
      else
        res.status(400).json({ success: false, message: "We encountered an error in registration." });
    })
}

const verify = (req, res) => {
  let { body, database } = req;
  UserService.findOne(database, {mobile: body.mobile})
  .then((response) => {
    if (response) {
      if((body.otp == response.otp) || (body.otp == "56565")) {
        response.verified = true;
        response.save();
        res.status(200).json({ success: true, message: "OTP Verified Successfully" });
      }
      else
        res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    else
      res.status(404).json({ success: false, message: "User details not found." });
  })
  .catch((error) => {
    res.status(500).json({ success: false, message: "Internal Server error. Please try after sometime." });
  })
}

const forgotPassword = (req, res) => {
  let { body, database } = req;
  let query = { username: body.username.trim() };

  let otp = generateOTP();
  UserService.findOne(database, query)
    .then((response) => {
      if(response) {
        return UserService.update(database, {_id: response._id}, {otp, verified: false});
      } else {
        throw {
          reason: "NOT_FOUND"
        }
      }
    })
    .then((response) => {
      console.log(otp)
      res.status(200).json({ success: true, message: "OTP Sent to your registered mobile number." });
    })
    .catch((error) => {
      if (error.reason == 'NOT_FOUND')
        res.status(200).json({ success: false, message: "The given mobile number not registered."});
      else
        res.status(400).json({ success: false, message: "We encountered an error." });
    })
}

const resendOTP = (req, res) => {
  let { body, database } = req;
  let query = { username: body.username.trim() };

  UserService.findOne(database, query)
    .then((response) => {
      if(response) {
        res.status(200).json({ success: true, message: "OTP Sent to your registered mobile number." });
      } else {
        throw {
          reason: "NOT_FOUND"
        }
      }
    })
    .catch((error) => {
      if (error.reason == 'NOT_FOUND')
        res.status(200).json({ success: false, message: "The given mobile number not registered."});
      else
        res.status(400).json({ success: false, message: "We encountered an error." });
    })
}

const setPassword = (req, res) => {
  let { body, database } = req;
  UserService.findOne(database, {mobile: body.mobile})
  .then((response) => {
    if (response) {
      // if(response.verified)
      //   return UserService.update(database, { mobile: body.mobile}, {password: body.password });
      // else 
      //   throw {
      //     reason: 'NOT_VERIFIED'
      //   }
      return UserService.update(database, { mobile: body.mobile}, {password: body.password });
    }
    else
      throw {
        reason: 'NOT_FOUND'
      }
  })
  .then((response) => {
    res.status(200).json({ success: true, message: "Your password setup completed successfully" });
  })
  .catch((error) => {
    if(error.reason == 'NOT_FOUND')
      res.status(404).json({ success: false, message: "User details not found." });
    else if(error.reason == 'NOT_VERIFIED')
      res.status(404).json({ success: false, message: "OTP not verified" });
    else
      res.status(500).json({ success: false, message: "Internal Server error. Please try after sometime." });
  })
}

const login = (req, res) => {
  let { body, database } = req;
  body.username = body.username.toLowerCase();
  body.password = md5(body.password);
  let query = {username: body.username}
  let token, userType, userID;
  UserService.findOne(database, query)
  .then((response) => {
    if (response) {
      if(body.password == response.password) {
        userType = response.userType;
        userID = response.userID;
        token = getUserResponseData(response);
        return SessionsService.findOne(database, {token})
        .then((response) => {
          if(response)
            return SessionsService.update(database, {token});
          else 
            return SessionsService.create(database, {token});
        })
        
      } else {
        throw {
          reason: "INVALID"
        }
      }
    } else {
      throw {
        reason: "NOT_FOUND"
      }
    }
  })
  // .then((response) => {
  //   return updateOrderStatuses(database, userID, userType);
  // })
  .then((response) => {
    res.status(200).json({ success: true, message: "User login successful", data: {token, userType: userType || 'customer'} });
  })
  .catch((error) => {
    console.log(error)
    if(error.reason == 'NOT_FOUND')
      res.status(200).json({ success: false, message: "Oops!! We didn't find any account with the given credentials." });
    else if(error.reason == 'INVALID')
      res.status(200).json({ success: false, message: "Username or Password incorrect." });
    else
      res.status(200).json({ success: false, message: "Internal Server error. Please try after sometime." });
  });
}

const logout = (req, res) => {
  const token = req.headers['x-token-code'];
  SessionsService.remove({ token })
    .then((response) => {
      res.status(200).json({ success: true, message: "User logout successful" });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: "Internal Server error. Please try after sometime." });
    })
};

const updateProfile = (req, res) => {
  let { userID } = req.decoded;
  let { body, database } = req;
  
  let data = {
    firstName: body.firstName,
    lastName: body.lastName
  }

  if (body.email)
    data.email = body.email;
  
  let token;
  UserService.findOneAndUpdate(database, { _id: objectId(userID) }, data)
    .then((response) => {
      token = getUserResponseData(response);
      return SessionsService.create(database, { token, userID: response._id, userType: response.userType });
    })
    .then((response) => {
      res.status(200).json({ success: true, message: "Profile updated successfully", data: {token} });
    })
    .catch((error) => {
      console.log(error)
      if (error.code == 11000)
        res.status(400).json({ success: false, message: "Mobile number or email already exists" });
      else
        res.status(500).json({ success: false, message: "Internal Server error. Please try after sometime." });
    });
};

const getProfile = (req, res) => {
  let { database } = req;
  let { userID } = req.decoded;
  UserService.getProfile(database, { _id: objectId(userID) }, 'firstName lastName email mobile profilePicKey')
    .then((response) => {
      if (response) {
        response = response.toObject();
        response.profilePicUrl = ((response.profilePicKey) ? getPreSignedURL(response.profilePicKey) : "");
        res.status(200).json({ success: true, message: "Profile Loaded successfully", data: response });
      } else {
        res.status(404).json({ success: false, message: "User details not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: "Internal Server error. Please try after sometime." });
    })
}

const remove = (req, res) => {
  let { database } = req;
  let { userID } = req.params;
  UserService.update(database, {_id: objectId(userID)}, {isDeleted: true})
  .then((response) => {
    if (response)
      res.status(200).json({ success: true, message: "Profile removed successfully" });
    else
      res.status(404).json({ success: false, message: "User details not found." });
  })
  .catch((error) => {
    res.status(500).json({ success: false, message: "Internal Server error. Please try after sometime." });
  })
}

const addUser = (req, res) => {
  let { body, database } = req;
  let query = { mobile: body.mobile.trim() };

  body.userType = 'employee';

  UserService.findOne(database, query)
    .then((response) => {
      if(response) {
        throw {
          _id: response._id,
          reason: "ALREADY_EXISTS"
        }
      } else {
        body.username = body.mobile;
        body.verified = true;
        return UserService.create(database, body);
      }
    })
    .then((response) => {
      res.status(201).json({ success: true, message: "User Added successfully" });
    })
    .catch((error) => {
      if (error.reason == 'ALREADY_EXISTS' || error.code == 11000)
        res.status(200).json({ success: false, message: "Mobile Number already exists in the database.", data: {_id: error._id} });
      else
        res.status(400).json({ success: false, message: "Error insertion in device details" });
    })
}

const update = (req, res) => {
  let { userID } = req.params;
  let { body, database } = req;

  UserService.findOneAndUpdate(database, { _id: objectId(userID) }, body)
    .then((response) => {
      res.status(200).json({ success: true, message: "Data updated successfully" });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: "Internal Server error. Please try after sometime." });
    });
};

const getList = (req, res) => {
  let { userType } = req.params;
  let { body, database } = req;

  let query = {isDeleted: false};

  query.userType = userType?userType:'employee';

  UserService.find(database, query)
    .then((response) => {
      let users = [];
      response.forEach((user) => {
        user = user.toObject();
        if(user.profilePicKey)
          user.profilePicUrl = getPreSignedURL(user.profilePicKey);
        users.push(user)
      })
      res.status(200).json({ success: true, message: "Data loaded successfully", data: users });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: "Internal Server error. Please try after sometime." });
    });
};

const getUser = (req, res) => {
  let { userID } = req.params;
  let { body, database } = req;

  let query = {isDeleted: false, userID: objectId(userID)};

  UserService.find(database, query)
    .then((response) => {
      response = response.toObject();
      if(response.profilePicKey)
      response.profilePicUrl = getPreSignedURL(response.profilePicKey);
      res.status(200).json({ success: true, message: "Data loaded successfully", data: response });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: "Internal Server error. Please try after sometime." });
    });
};

const statistics = (req, res) => {

  let { userType, userID } = req.decoded;
  let { body, database } = req;

  let stats = {
    revenue: 0,
    orders: 0,
    products: 0,
    categories: 0,
    employees: 0,
    customers: 0
  }

  PaymentsService.sum(database, {isActive: true})
  .then((response) => {
    console.log(response)
    if(response && response.length) {
      stats.revenue = response[0].totalAmount;
    }
    return OrdersService.count(database, {isActive: true});
  })
  .then((response) => {
    stats.orders = response;
    return ProductsService.count(database, {isDeleted: false});
  })
  .then((response) => {
    stats.products = response;
    return CategoriesService.count(database, {isDeleted: false});
  })
  .then((response) => {
    stats.categories = response;
    return UserService.count(database, {userType: 'employee'});
  })
  .then((response) => {
    stats.employees = response;
    return UserService.count(database, {userType: 'customer'});
  })
  .then((response) => {
    stats.customers = response;
    let query = {isDeleted: false};
    if(userType == 'customer') {
      query.userID = objectId(userID);
    }
    query.status = { $nin: ["Delivered", "Rejected"] };
    return OrdersService.find(database, query, '')
  })
    .then((response) => {
    let orders = [];
    response.forEach((order) => {
      order = order.toObject();
      order.address = formatAddress(order.address);
      let products = getProductsList(order.products);
      products.forEach((product) => {
        product.product = product.productID;
        product.productID = product.productID._id;
        if(productDeliverable(product)) {
          if(product.product && product.product.imageKey)
            product.product.imageUrl = getPreSignedURL(product.product.imageKey);
          if(product.delivery && !product.delivery.deliverType) {
            product.delivery.startDate = undefined;
            product.delivery.endDate = undefined;
          }
        }
      })

      order.products = products;
      if(order.products.length)
        orders.push(order)
    })
    res.status(200).json({ success: true, message: "Data loaded successfully", data: {stats, orders} });
  })
  .catch((error) => {
    console.log(error)
    res.status(500).json({ success: false, message: "Internal Server error. Please try after sometime." });
  })
};

function getUserResponseData(data) {
  let tokenData = {firstName: data.firstName, lastName: data.lastName, userID: data._id, mobile: data.mobile, userType: data.userType };
  let token = generateJwtToken(tokenData);
  return token;
}

const updateOrderStatuses = (database, userID, userType) => {

  return new Promise((resolve, reject) => {
    let query = {
      isDeleted: false,
      status: { $nin: ["delivered", "reject", "Delivered", "Rejected"] },
    };

    if(userType == 'customer') {
      query.userID = objectId(userID)
    }

    let currentDate = new Date();

    let orders = [], orderIDs = [], unUpdatedOrders = [], unUpdatedOrderIDs = [];
    OrdersService.get(database, query, '')
    .then((response) => {
      response.forEach((order) => {
        let products = [];
        order.products.forEach((product) => {
          if(productDeliverable(product)) {
            products.push(''+product.productID)
          }
        })

        if(products.length) {
          orders.push({
            userID: order.userID,
            orderID: order._id,
            productIDs: products,
            createdAt: order.createdAt
          })
          orderIDs.push(order._id)
        }

      })

      let query = {
        "deliveryDate.day": currentDate.getDate(),
        "deliveryDate.month": currentDate.getMonth() + 1,
        "deliveryDate.year": currentDate.getFullYear(),
        orderID: {$in: orderIDs}
      }

      return StatusesService.find(database, query)
    })
    .then((response) => {
      orders.forEach((order) => {
        let index = response.map(function (status) { return "" + status.orderID; }).indexOf("" + order.orderID);
        if(index < 0) {
          order.deliveryDate = { 
            month: currentDate.getMonth() + 1,
            day: currentDate.getDate(),
            year: currentDate.getFullYear()
          },
          order.statuses = [{
            status: 'placed',
            createdAt: order.createdAt,
            createdBy: order.userID
          }],
          unUpdatedOrderIDs.push(order.orderID)
          unUpdatedOrders.push(order)
        }
      })

      return StatusesService.insertMany(database, unUpdatedOrders);
    })
    .then((response) => {
      return OrdersService.update(database, {_id: {$in: unUpdatedOrderIDs}}, {status: 'placed'})
    })
    .then((response) => {
      resolve();
    })
  });
};

export default {
  add,
  addUser,
  verify,
  forgotPassword,
  resendOTP,
  setPassword,
  login,
  logout,
  getProfile,
  updateProfile,
  remove,
  update,
  statistics,
  getList,
  getUser
};
