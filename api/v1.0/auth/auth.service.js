'use strict';

import _ from 'lodash';
import mongoose from "mongoose";
import moment from "moment";
import AWS from "aws-sdk";
import config from '../../../config/config';

AWS.config.loadFromPath('./config/s3_credentials.json');

const BucketName = config.default.awsS3.bucketName;
const s3Bucket = new AWS.S3({ params: { Bucket: BucketName } });
import { getDatabaseConnection, getGCMKey, getMerchantID } from '../../../config/connections';

import { decodeJwtToken, uploadToS3, uploadHTML } from '../../../common/utils.js';

import SessionsService from '../sessions/services/sessions.services';

import { merchants } from "../../../config/constants";

const objectId = mongoose.Types.ObjectId;

let isUser = {};

isUser.authenticated = (req, res, next) => {
  const token = req.headers['x-token-code'];
  let { database } = req;
  if (token) {
    SessionsService.findOne(database, { token: token })
      .then((response) => {
        if (response) {
          decodeJwtToken(token)
            .then(decoded => {
              req.decoded = decoded.data;
              next();
            })
            .catch((error) => {
              res.status(401).json({ success: false, reason: 'INVALID_TOKEN', message: "Your Login Token Expired. Please Login." });
            });
        } else {
          throw {}
        }
      })
      .catch((error) => {
        console.log(error)
        res.status(401).json({ success: false, reason: 'INVALID_TOKEN', message: "Your Login Token Expired. Please Login." });
      });
  } else {
    res.status(401).json({ success: false, reason: 'INVALID_TOKEN', message: "You are not authorised." });
  }
};

isUser.auth = (req, res, next) => {
  const token = req.headers['x-token-code'];
  if (token) {
    decodeJwtToken(token)
      .then(decoded => {
        req.decoded = decoded.data;
        next();
      })
      .catch((error) => {
        console.log(error)
        res.status(401).json({ success: false, reason: 'INVALID_TOKEN', message: "Your Login Token Expired. Please Login." });
      });
  } else {
    res.status(401).json({ success: false, reason: 'INVALID_TOKEN', message: "You are not authorised." });
  }
};

isUser.authorised = (req, res, next) => {
  const licenseKey = req.headers['x-license-key'];
  const accessKey = req.headers['x-access-key'];
  const merchantID = req.headers['x-merchant-id'];
  const token = req.headers['x-token-code'];
  if ((licenseKey && accessKey) || (merchantID)) {
    new Promise(function (resolve, reject) {
      return resolve(getDatabaseConnection(licenseKey, accessKey, merchantID));
    })
      .then((response) => {
        if (response) {
          req.database = response;
          next();
        } else {
          throw {};
        }
      })
      .catch((error) => {
        console.log(error)
        res.status(200).json({ success: false, session: error.session, message: "Suspended or You don't have authorised keys" });
      })

  } else {
    res.status(200).json({ success: false, message: "You don't have authorised keys" });
  }

}

isUser.hasUserID = (req, res, next) => {
  const token = req.headers['x-token-code'];
  if (token) {
    decodeJwtToken(token)
      .then(decoded => {
        req.userID = decoded.data.userID;
        next();
      })
      .catch((error) => {
        next();
      });
  } else {
    next();
  }
};

isUser.hasToken = (req, res, next) => {
  const token = req.headers['x-token-code'];
  if (token) {
    decodeJwtToken(token)
      .then(decoded => {
        req.decoded = decoded.data;
        next();
      })
      .catch((error) => {
        next();
      });
  } else {
    next();
  }
}

isUser.hasPermission = (req, res, next) => {
  const token = req.headers['x-token-code'];
  if (token) {
    decodeJwtToken(token)
      .then(decoded => {
        // if((decoded.data.userType == 'admin') || (decoded.data.userType == 'superadmin'))
        if(true)
          next();
        else
          throw {}
      })
      .catch((error) => {
        res.status(200).json({ success: false, message: "You are not authorised for this action." });
      });
  } else {
    res.status(200).json({ success: false, message: "You are not authorised for this action." });
  }
}

let requires = {};

requires.body = (req, res, next) => {

  if (!_.isEmpty(req.body)) next();
  else res.json({ success: false, message: 'Request Body is Empty. Please Provide Data.' });
};

requires.masterKey = (req, res, next) => {
  if (req.headers["x-master-key"] == "SZAcFTsIMwYBcvPGCyQBcHIDvuenBYsCmkOdLqWtIADxOkdWJMwIDNMditwLiLnI") {
    next();
  } else {
    res.status(401).json({ success: false, reason: 'INVALID_ACCESS_KEY', message: "Request doesn't have access key" });
  }
}

requires.paymentKey = (req, res, next) => {
  if (req.headers["x-payment-key"] == "ApZAcF2IMwY1BcvPG22CyQ65B1cHI7IOue89nBYsCmkOdLqWtIop0xOkdWJM12DNMditwLiLnI") {
    next();
  } else {
    res.status(400).json({ success: false, reason: 'INVALID_PAYMENT_KEY', message: "Request doesn't have payment key" });
  }
}

let isBody = {};

isBody.hasCategoryImage = (req, res, next) => {
  let { body } = req;

  let fileExt = "";
  let imageKey = '';

  if (body.imageData) {
    if (body.imageData.indexOf("image/png") != -1)
      fileExt = "png";
    else if (body.imageData.indexOf("image/jpeg") != -1)
      fileExt = "jpeg";
    else if (body.imageData.indexOf("image/jpg") != -1)
      fileExt = "jpg";
    imageKey = "categories/category_" + body.name + "_" + moment().unix();
    req.body.imageKey = imageKey + "." + fileExt;
    uploadToS3(imageKey, 'image', fileExt, body.imageData);
    next();
  } else {
    next();
  }

}

isBody.hasProductImage = (req, res, next) => {
  let { body } = req;

  let fileExt = "";
  let imageKey = '';

  if (body.imageData) {
    console.log("If")
    if (body.imageData.indexOf("image/png") != -1) fileExt = "png";
    else if (body.imageData.indexOf("image/jpeg") != -1) fileExt = "jpeg";
    else if (body.imageData.indexOf("image/jpg") != -1) fileExt = "jpg";
    imageKey = "products/product_" + body.name + "_" + moment().unix();
    req.body.imageKey = `${imageKey}.${fileExt}`;
    uploadToS3(imageKey, "image", fileExt, body.imageData);
    next();
  } else {
    console.log("Else");
    next();
  }

}

isBody.hasCarouselImages = (req, res, next) => {

  if(!req.body.carouselImageKeys)
      req.body.carouselImageKeys = [];

  let { body } = req;

  console.log(body.carouselImages);

  async function f() {
    let carouselImages = [];
    
    if (req.body.carouselImages)
      carouselImages = await uploadCarousel(body.carouselImages, body.carouselImageKeys, req.params.productID);
    else
      carouselImages = body.carouselImages;

    req.body.carouselImageKeys = carouselImages;
    next();
  };

  f();
}

function uploadCarousel(files, carouselImageKeys, testID) {
  files.map((file) => {

    if (file && file.imageData) {
      return new Promise(function (resolve, reject) {

        let fileExt = "";
        let imageKey = '';

        if (file.imageData) {
          if (file.imageData.indexOf("image/png") != -1)
            fileExt = "png";
          else if (file.imageData.indexOf("image/jpeg") != -1)
            fileExt = "jpeg";
          else if (file.imageData.indexOf("image/jpg") != -1)
            fileExt = "jpg";
          imageKey = testID+"/carousel-images/carousel-image_" + file.name + "_" + moment().unix();

          carouselImageKeys.push({
            imageKey: `${imageKey}.${fileExt}`
          });
          
          return uploadToS3(imageKey, 'image', fileExt, file.imageData);
        }

      });
    }
  });

  return carouselImageKeys;
}

let assign = {};

assign.merchantID = (req, res, next) => {

  const licenseKey = req.headers['x-license-key'];
  const accessKey = req.headers['x-access-key'];

  merchants.forEach((merchant) => {
    if ((merchant.licenseKey === licenseKey) && (merchant.accessKey === accessKey)) {
      req.merchantID = merchant.merchantID;
      return;
    }
  });
  next();
}

export {
  isUser,
  requires,
  isBody,
  assign
};
