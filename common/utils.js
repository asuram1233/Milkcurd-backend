'use strict';

import config from '../config/config';
import jwt from 'jsonwebtoken';
import Promise from 'bluebird';
import otpGenerator from "otp-generator";
import AWS from "aws-sdk";
import moment from "moment";
import _ from "lodash";

import { weekDays } from '../config/constants';

AWS.config.loadFromPath('./config/s3_credentials.json');

const BucketName = config.default.awsS3.bucketName;
const s3Bucket = new AWS.S3({ params: { Bucket: BucketName } });

const uploadToS3 = (fileName, fileType, fileExt, fileData) => {
  console.log("Uploading")
  let data = new Buffer(fileData.replace("data:" + fileType + "\/" + fileExt + ";base64,", ""), "base64")
  var uploadabledata = {
    ACL: 'public-read',
    Key: fileName + '.' + fileExt,
    Body: data,
    ContentType: fileType + '/' + fileExt
  };
  s3Bucket.putObject(uploadabledata, function (err, response) {
    if (err) {
      console.log('Error in uploading', err);
    } else {
      console.log("uploaded: ", fileName + "." + fileExt);
    }
  });
};

const uploadImage = (uploadabledata, callback) => {
  s3Bucket.putObject(uploadabledata, function (err, response) {
    if (err) {
      console.log('Error in uploading Option', err);
    } else {
      console.log("Option Image: ", uploadabledata.Key);
      callback(true)
    }
  });
}

const uploadHTML = (fileName, fileData, callback) => {
  var uploadabledata = {
    ACL: 'public-read',
    Key: fileName,
    Body: fileData,
    ContentType: 'text/plain'
  };
  s3Bucket.putObject(uploadabledata, function (err, response) {
    if (err) {
      console.log('Error in uploading', err);
    } else {
      console.log("uploaded: ", fileName);
      callback(response);
    }
  });
};

const generateJwtToken = (data) => {

  let secretCode = config.default.jwt.secret;
  return jwt.sign({ data }, secretCode, { expiresIn: '365d' });

};

const decodeJwtToken = (jwtToken) => {
  let secretCode = config.default.jwt.secret;

  return new Promise((resolve, reject) => {
    jwt.verify(jwtToken, secretCode, (error, decodedData) => {
      if (!error) resolve(decodedData);
      else reject({ status: 'unauthorised', message: 'jwt expired' });
    });
  });
};

const permitCrossDomainRequests = (req, res, next) => {

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  let userAgent = req.headers['user-agent'];
  if ((req.headers.accept === '*/*' && !req.headers.referer) || userAgent.indexOf("Wget") >= 0 || userAgent.indexOf("WGet") >= 0 || userAgent.indexOf("wget") >= 0) {
    res.send('You are not allowed');
  } else {
    next();
  }
};

const getPreSignedURL = (awsFileKey) => {

  let s3 = new AWS.S3();
  let params = {
    Bucket: config.default.awsS3.bucketName,
    Key: awsFileKey,
    Expires: 86400
  };

  try {
    let url = s3.getSignedUrl('getObject', params);
    return url;
  } catch (err) {
    return "";
  }
}

const generateOTP = () => {
  return otpGenerator.generate(5, { alphabets: false, upperCase: false, specialChars: false });
}

const generateOrderID = (length) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  for (var i = 0; i < parseInt(length / 2); i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getReleaseTime(time) {
  if(time) {
    let { hour, minute } = time;

    let merediem = 'AM';

    if(hour >= 12)
      merediem = 'PM';
    hour = hour%12;

    return (hour<10?"0"+hour:hour)+":"+(minute<10?"0"+minute:minute)+" "+merediem;
  } else {
    return "";
  }
}

const getTime = (time) => {
  let hours = time.split(":")[0], minutes = time.split(":")[1];
  let merediem = (parseInt(hours) < 12)?"AM":"PM";
  
  if(hours == "00")
    hours = "12";
  else if(parseInt(hours)<10)
    hours = "0"+parseInt(hours);

  if(parseInt(minutes)<10)
    minutes = "0"+parseInt(minutes);

  return hours+":"+minutes+":"+merediem;
}

const getOffPercentage = (actualPrice, currentPrice) => {
  return Math.round(((actualPrice - currentPrice)/actualPrice)*100);
}

const formatAddress = (address) => {
  if(address.stateID) {
    address.stateName = address.stateID.name;
    address.stateID = address.stateID._id;
  }
  if(address.cityID) {
    address.cityName = address.cityID.name;
    address.cityID = address.cityID._id;
  }
  if(address.pincodeID) {
    address.pincode = address.pincodeID.pincode;
    address.pincodeID = address.pincodeID._id;
  }
  return address;
}

const checkExists = (startDate, endDate) => {
  let date = new Date()
  date = date.setHours(date.getHours() + 5);
  date = new Date(date)
  date = date.setMinutes(date.getMinutes() + 30);
  date = new Date(date)
  
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  startDate.setHours(5);
  startDate.setMinutes(30);

  endDate.setHours(29);
  endDate.setMinutes(29);

  if((date.getTime() >= startDate.getTime()) && (date.getTime() <= endDate.getTime()))
    return true;
  else
    return false;
}

function getDates(startDate, endDate) {
  let date = [];

  for (var m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
      date.push(m.format('YYYY-MM-DD'));
  }

  return date;
}

function alternateDays(dates) {
  let days = [];
  dates.forEach((day, index) => {
    if(index%2 ==0)
    days.push(day)
  })
  return days;
}

const productDeliverable = (product) => {
  let deliverable = false;
  if(!product.delivery.deliverType)
    deliverable = true;
  else {
    let { customDays, deliverType, startDate, endDate } = product.delivery;
    switch (deliverType) {
      case "daily":
        deliverable = checkExists(startDate, endDate);
        break;
      case "alternate":
        let dates = getDates(startDate, endDate);
        dates = alternateDays(dates);
        let date = moment().format("YYYY-MM-DD");
        if (dates.indexOf(date) >= 0) deliverable = true;
        break;
      case "custom":
        if (checkExists(startDate, endDate)) {
          let date = new Date();
          let today = weekDays[date.getDay()];
          customDays.forEach((customDay) => {
            if (today == customDay.day) deliverable = true;
          });
        }
        break;
      case "Instant":
        deliverable = true;
        break;
    }
  }

  return deliverable;
}

const getProductsList = (products) => {
  let list = [], today = moment().format("YYYY-MM-DD"), day = moment().format('dddd').toLowerCase();
  products.forEach((product) => {
    let startDate = moment(product.delivery.startDate).format("YYYY-MM-DD");
    let endDate = moment(product.delivery.endDate).format("YYYY-MM-DD");
    if (product.delivery.deliverType == "Instant") {
      if (today == startDate) {
        list.push(product);
      }
    } else if(product.delivery.deliverType == "daily") {
      if (new Date(endDate).getTime() >= new Date(today).getTime()) {
        list.push(product);
      }
    } else if (product.delivery.deliverType == "custom") {
      if ((new Date(endDate).getTime() >= new Date(today).getTime()) && (product.delivery.customDays.indexOf(day) >= 0)) {
        list.push(product);
      }
    }
  })
  return list;
}


export {
  getReleaseTime,
  uploadToS3,
  generateJwtToken,
  decodeJwtToken,
  permitCrossDomainRequests,
  getPreSignedURL,
  generateOTP,
  uploadHTML,
  uploadImage,
  generateOrderID,
  getTime,
  getOffPercentage,
  formatAddress,
  productDeliverable,
  getProductsList,
};
