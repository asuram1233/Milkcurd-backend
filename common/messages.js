'use strict';

import config from '../config/config';
import request from "request";
import { getMerchant, getMerchantByID } from "../config/connections";

const sendMessage = (url) => {
  request.get({
    url: url,
    json: true
  }, function (err, response, body) {
    if (err) {
      console.log("ERROR: ", err);
    } else {
      console.log("RESPONSE: ", body);
    }
  });
}

const sendOTPSMS = (licenseKey, accessKey, data) => {
  console.log(licenseKey, accessKey, data)
  // let { name, mobile, otp } = data;
  // let merchant = getMerchant(licenseKey, accessKey);
  // if (merchant && merchant.otpURL) {
  //   let url = merchant.otpURL;
  //   url = url.replace("7997555777", mobile);
  //   url = url.replace("12345", otp)
  //   sendMessage(url);
  // }
}

const sendSMSCampaign = (merchantID, mobiles, data) => {
  // let merchant = getMerchantByID(merchantID);
  // if (merchant && merchant.promotionalURL) {
  //   let url = merchant.promotionalURL;
  //   url = url.replace("7997555777", mobiles);
  //   url = url.replace("SMS_TEXT", data)
  //   sendMessage(url);
  // }
}

const sendOrderHistory = (licenseKey, accessKey, mobile, orderID) => {
  // let merchant = getMerchant(licenseKey, accessKey);
  // if (merchant && merchant.transactionURL) {
  //   let url = merchant.transactionURL;
  //   url = url.replace("7997555777", mobile);
  //   url = url.replace("VAR1_VALUE", orderID)
  //   sendMessage(url);
  // }
}

export {
  sendMessage,
  sendOTPSMS,
  sendOrderHistory,
  sendSMSCampaign
}
