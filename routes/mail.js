"use strict";
var nodemailer = require ("nodemailer");
var express = require('express');
var router = express.Router();

var nodemailer = require ("nodemailer");
function main(){
    console.log("ZXc");
    let transport = nodemailer.createTransport({
        host:"smtp.163.com",
        secureConnection : true,
        port: 465,
        secure: true,
        auth:{
            user: 'spmtest2021@163.com',
            pass: 'DPSSYJVCYFRCNCPF'
        }
    });
    let info = transport.sendMail({
        from: '"Coder" <spmtest2021@163.com>',
        to: "spmtest2021@163.com>",
        subject: 'test',
        text: '{{fname}}',
        html:"<h1> Hello World </h1>"
    });
    console.log(info);
}


module.exports.main = main();
module.exports = router;