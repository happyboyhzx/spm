var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('users');

// var nodemailer = require ("nodemailer");
// function main(){
//     let transport = nodemailer.createTransport({
//         host:"smtp.163.com",
//         secureConnection : true,
//         port: 465,
//         secure: true,
//         auth:{
//             user: 'spmtest2021@163.com',
//             pass: 'ZBCIVURLFPZKGGXE'
//         }
//     });
//     let info = transport.sendMail({
//         from: '"Coder" <spmtest2021@163.com>',
//         to: "spmtest2021@163.com>",
//         subject: 'test',
//         text: '{{fname}}',
//         html:"<h1> Hello World </h1>"
//     });
//     console.log(info);
//
// }

var userController = require('../../controllers/user-controller.js');
/* GET users listing. */
router.get('/', function(req, res) {

    if (req.cookies["Username"] == null) {
        res.redirect("/user/login");
    } else {
        var username = req.cookies["Username"];
        User.findOne({accountName:username}, function(err, result) {
            var photo = result.photo;
            var myPhoto = result.myphoto;
            var fname = result.fname;
            var lname = result.lname;
            var country = result.country;
            var subject = result.content;
            var birthday = result.birthday;
            var gender = result.gender;
            var occupation = result.occupation;
            var customizekey1 = result.customizekey1;
            var customizeInfo1 = result.customizeInfo1;
            var customizekey2 = result.customizekey2;
            var customizeInfo2 = result.customizeInfo2;
            var customizekey3 = result.customizekey3;
            var customizeInfo3 = result.customizeInfo3;
            var schooltype = result.schooltype;
            var acceptanceId = result.acceptanceId;
            var startTime = result.startTime;
            var endedTime = result.endedTime;
            var specialized = result.specialized;
            var numOfStudent = result.numOfStudent;
            var totalmoney = result.totalmoney;
            var statu = result.statu;
            var cancelReason = result.cancelReason;
            var PDF = result.PDF;
            var image = result.image;
            var myPhoto = result.myPhoto;
            var myPDF = [];
            var myImage = [];

            for(var i = 0; i < PDF.length; i++){
                myPDF[i] = PDF[i].toObject();
            }

            for(var j = 0; j < image.length; j++){
                myImage[j] = image[j].toObject();
            }

            res.render('folio/edit-folio', {
                layout: "myfolio",
                title: "edit my folio",
                username: username,
                photo: photo,
                myPhoto: myPhoto,
                PDF: myPDF,
                image: myImage,
                fname: fname,
                lname: lname,
                country: country,
                subject: subject,
                birthday: birthday,
                gender: gender,
                occupation: occupation,
                customizekey1: customizekey1,
                customizekey2: customizekey2,
                customizekey3: customizekey3,
                customizeInfo1: customizeInfo1,
                customizeInfo2: customizeInfo2,
                customizeInfo3: customizeInfo3,
                acceptanceId: acceptanceId,
                schooltype: schooltype,
                startTime: startTime,
                specialized: specialized,
                numOfStudent: numOfStudent,
                totalmoney: totalmoney,
                statu: statu,
                cancelReason: cancelReason,
                endedTime: endedTime});
        })
    }
});


router.post('/update', userController.updateUser);
router.post('/insert', userController.createUser);
module.exports = router;