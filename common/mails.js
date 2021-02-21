'use strict';

import nodemailer from "nodemailer";
import smtpTransport from 'nodemailer-smtp-transport';
import config from "../config/config";
import { getMerchant, getMerchantByID } from "../config/connections";
import ses from "nodemailer-ses-transport";

import moment from "moment";

import ejs from "ejs";

const sendAWSMailer = (data) => {
  var transporter = nodemailer.createTransport(ses({
    accessKeyId: 'AKIAYZUTSU3ZOZDQNA67',
    secretAccessKey: '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',
    region: 'ap-south-1'
  }));

  let mailOptions = {
    // from: '<contact@tetu.in>', // sender address
    to: data.toEmail,
    subject: data.subject,
    html: data.html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    console.log(error)
    console.log(info)
  })
}

const DemoEmail = (data) => {
  ejs.renderFile('./config/mail-templates/demo-confirmation.ejs', { name: data.name, email: data.email }, function (err, html) {
    if (html) {
      sendAWSMailer({ toEmail: data.email, subject: "TeTu LMS: Demo Request Confirmation", content: "", html });
    }
  })
  ejs.renderFile('./config/mail-templates/demo-request.ejs', data, function (err, html) {
    if (html) {
      sendAWSMailer({ toEmail: "laxminarayana.official@gmail.com, santhoshk.korimi@gmail.com, jsanjeevmnp@gmail.com", subject: "TeTu LMS: Demo Request", content: "", html });
    }
  })
}

export {
  DemoEmail
};
