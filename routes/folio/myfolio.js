var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('users');

var userController = require('../../controllers/user-controller.js');
/* GET users listing. */
router.get('/', function(req, res) {

    if (req.cookies["Username"] == null) {
        res.redirect("/user/login");
    } else {
        var username = req.cookies["Username"];
        res.redirect("/myfolio/"+username);
    }

});

router.get('/:id', function(req, res) {

    if (req.cookies["Username"] == null) {
        var username = req.params.id;
        User.findOne({accountName:username}, function(err, result) {
            var file = result.file;
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
            var acceptanceId = result.acceptanceId;
            var schooltype = result.schooltype;
            var startTime = result.startTime;
            var endedTime = result.endedTime;
            var PDF = result.PDF;
            var image = result.image;
            var myPhoto = result.myPhoto;
            var myPDF = [];
            for(var i = 0; i < PDF.length; i++){
                myPDF[i] = PDF[i].toObject();
            }

            var myImage = [];
            for(var j = 0; j < image.length; j++){
                myImage[j] = image[j].toObject();
            }


            res.render('folio/myfolio', {
                layout: "myfolio",
                title: "myFolio",
                username: visitorUsername,
                folioUsername: username,
                editDisplay: "none",
                myPhoto: myPhoto,
                file: file,
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
                schooltype :schooltype,
                startTime :startTime,
                endedTime : endedTime,
                photo:"../resource/default.jpg"});
        })
    } else {
        var visitorUsername = req.cookies["Username"];
        User.findOne({accountName:visitorUsername}, function(err, result) {
            var visitorAvatar = result.photo;
            var username = req.params.id;
            var editDisplay = "none";
            if (username == visitorUsername){editDisplay = "block";}
            User.findOne({accountName:username}, function(err, result) {
                var file = result.file;
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
                var PDF = result.PDF;
                var myPhoto = result.myPhoto;
                var myPDF = [];
                var image = result.image;
                for(var i = 0; i < PDF.length; i++){
                    myPDF[i] = PDF[i].toObject();
                }

                var myImage = [];

                for(var j = 0; j < image.length; j++){
                    myImage[j] = image[j].toObject();
                }

                res.render('folio/myfolio', {
                    layout: "myfolio",
                    title: "myFolio",
                    username: visitorUsername,
                    photo: visitorAvatar,
                    folioUsername: username,
                    editDisplay: editDisplay,
                    myPhoto: myPhoto,
                    file: file,
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
                    endedTime: endedTime
                });
            })
        })
    }

});
router.post('/update', userController.updateUser);
router.post('/insert', userController.createUser);

module.exports = router;