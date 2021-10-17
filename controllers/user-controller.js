var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var nodemailer = require ("nodemailer");
var User = mongoose.model('users');


//to load all users who has already signed in;
var findAllUsers = function(req, res, next) {
    User.find()
        .lean()
        .then(function(doc) {
            res.render('user/sign-up', {layout: 'user-page', items: doc});
        });
};



//the functionality that allowed user sign up;
var createUser = async function(req, res, next) {


    var accountName = req.body.accountName, password = req.body.password;
    var photo = req.body.photo;
    var confirmPassword = req.body.confirmPassword;
    var isValid = false;
    var identical = false;
    var textMessage = "";



    //make sure that the account name and password are not blank and the password is not too short;
    if (!accountName || accountName == "") {
        textMessage = "Please enter your username";
        res.render('user/sign-up', {layout: 'user-page', message:textMessage});
        return;
    } else if (!password || password == "") {
        textMessage = "Please enter your password";
        res.render('user/sign-up', {layout: 'user-page', message:textMessage});
        return;
    } else if (password.length < 6) {
        textMessage = "Password too short! Must longer than 6 digits";
        res.render('user/sign-up', {layout: 'user-page', message:textMessage});
        return;
    }

    if (confirmPassword === password) {
        //avoid the duplicate user name;
        identical = true;
    }
    else{
        textMessage = "Passwords are not identical!";
        res.render('user/sign-up', {layout: 'user-page', message:textMessage});
        return;
    }
    await User.count({accountName: accountName}, function (err, count) {
        if (err) {
            console.log('error occured in the database');
        }
        if (count == 0) {
            textMessage = "Successfully signed in, please log in here";
            isValid = true;
        } else if (count == 1) {
            textMessage = "Username has already been used";
        } else {
            textMessage = "Username has already been used. duplicate found";
        }

        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);

        if (isValid && identical) {
            var item = {
                accountName: accountName,
                password: hash,
                photo: photo
            };


            var data = new User(item);
            data.save();

            res.redirect('/user/login');
            return;
        } else {
            res.render('user/sign-up', {layout: 'user-page', message: textMessage});
            return;
        }
    });

    //console.log(textMessage);
    // if (isValid) {
    //     var item = {
    //         accountName:accountName,
    //         password:password
    //     };
    //
    //     var data = new User(item);
    //     data.save();
    //
    //     res.redirect('/user/login');
    //     return;
    // } else {
    //     if(textMessage == ''){
    //         //textMessage = 'Something wrong, please try again later';
    //         res.render('user/sign-up', {layout: 'user-page', message:textMessage});
    //         return;
    //     }
    //     res.render('user/sign-up', {layout: 'user-page', message:textMessage});
    //     return;
    // }
};

function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
            break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
            break;
        default:
            return 0;
            break;
    }
}

var updateUserInfo = function(req, res, next) {
    var fname = req.body.firstname;
    var lname = req.body.lastname;
    var country = req.body.country;
    var gender = req.body.gender;
    var birthday = req.body.bday;
    var occupation = req.body.occupation;
    var selfDescription = req.body.subject;


    var customizekey1 = req.body.customkey1;
    var customizeInfo1 = req.body.customvalue1;
    var customizekey2 = req.body.customkey2;
    var customizeInfo2 = req.body.customvalue2;
    var customizekey3 = req.body.customkey3;
    var customizeInfo3 = req.body.customvalue3;
    var schooltype = req.body.schooltype1;
    var acceptanceId;
    acceptanceId = randomNum(100,999);

    var accName = req.cookies["Username"];

    User.findOne({accountName:accName}, function(err, result){
        if (err) {
            console.log('error occured in the database');
        }
        userInfo = result;
        var id = userInfo._id;

        User.findById(id, function(err, doc) {
            if (err) {
                console.error('error, no user found');
            }


            doc.fname = fname;
            doc.lname = lname;
            doc.country = country;
            doc.content = selfDescription;

            doc.birthday = birthday;
            doc.gender = gender;
            doc.occupation = occupation;

            doc.customizekey1 = customizekey1;
            doc.customizeInfo1 = customizeInfo1;
            doc.customizekey2 = customizekey2;
            doc.customizeInfo2 = customizeInfo2;
            doc.customizekey3 = customizekey3;
            doc.customizeInfo3 = customizeInfo3;
            doc.schooltype = schooltype;
            if (doc.acceptanceId == null){
                doc.acceptanceId = acceptanceId;
            }


            var nodemailer = require ("nodemailer");
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
            transport.sendMail({
                from: '"Coder" <spmtest2021@163.com>',
                to: "<spmtest2021@163.com>",
                subject: "New expression",
                text: "School Name："+fname + "\n"+
                    "Address: " + lname + "\n" +"School Type: " + schooltype + "\n" +
                    "Message: " + selfDescription
                //html:"<h1> Hello World </h1><br>"
            });


            doc.save();
            res.redirect("/");
            return;
        });
    });

}

var updatePDF = function(req, res, next){

    var PDFfile = req.body.PDFfile;
    var PDFDescription = req.body.PDFDescription;
    var accName = req.cookies["Username"];
    if(accName != null){
        var accName = req.cookies["Username"];
        if(PDFfile != null && PDFfile != "" && PDFDescription != ""){
            User.findOne({accountName:accName}, function(err, result){
                if (err) {
                    console.log('error occured in the database');
                }
                var userInfo = result;
                var id = userInfo._id;

                User.findById(id, function(err, doc) {
                    if (err) {
                        console.error('error, no user found');
                    }
                    doc.PDF.push({file: PDFfile, description: PDFDescription});
                    doc.save();
                });
            });
        }

        if(PDFfile == null || PDFfile == ""){
            textMessage = "Please choose at least one PDF file ";
            res.send(textMessage+'<a href = "/edit-myfolio">Go Back</a>');
            return ;
        }

        if(PDFDescription == null || PDFDescription == ""){
            textMessage = "Please add some description to your PDF file ";
            res.send(textMessage+'<a href = "/edit-myfolio">Go Back</a>');
            return ;
        }
    }
    res.redirect("/edit-myfolio");
}

var updateUser = function(req, res, next) {
    var accountName = req.body.accountName;
    var password = req.body.password;
    var photo = req.body.photo;
    var file = req.body.file;
    var PDFfile = req.body.PDFfile;
    var PDFDescription = req.body.PDFDescription;

    //var fname = req.body.firstname;
    // var lname = req.body.lastname;
    // var country = req.body.country;
    // var gender = req.body.gender;
    // var birthday = req.body.bday;
    // var occupation = req.body.occupation;
    // var selfDescription = req.body.subject;
    //
    // var customizekey1 = req.body.customkey1;
    // var customizeInfo1 = req.body.customvalue1;
    // var customizekey2 = req.body.customkey2;
    // var customizeInfo2 = req.body.customvalue2;
    // var customizekey3 = req.body.customkey3;
    // var customizeInfo3 = req.body.customvalue3;



    // if(fname != null){
    //     var accName = req.cookies["Username"];
    //     if(PDFfile != null && PDFfile != "" && PDFDescription != ""){
    //         User.findOne({accountName:accName}, function(err, result){
    //             if (err) {
    //                 console.log('error occured in the database');
    //             }
    //             userInfo = result;
    //             var id = userInfo._id;
    //
    //             User.findById(id, function(err, doc) {
    //                 if (err) {
    //                     console.error('error, no user found');
    //                 }
    //                 doc.PDF.push({file: PDFfile, description: PDFDescription});
    //                 doc.save();
    //             });
    //         });
    //     }
    //
    //
    //
    //     // User.findOne({accountName:accName}, function(err, result){
    //     //     if (err) {
    //     //         console.log('error occured in the database');
    //     //     }
    //     //     userInfo = result;
    //     //     var id = userInfo._id;
    //     //
    //     //     User.findById(id, function(err, doc) {
    //     //         if (err) {
    //     //             console.error('error, no user found');
    //     //         }
    //     //
    //     //
    //     //         doc.fname = fname;
    //     //         doc.lname = lname;
    //     //         doc.country = country;
    //     //         doc.content = selfDescription;
    //     //
    //     //         doc.birthday = birthday;
    //     //         doc.gender = gender;
    //     //         doc.occupation = occupation;
    //     //
    //     //         doc.customizekey1 = customizekey1;
    //     //         doc.customizeInfo1 = customizeInfo1;
    //     //         doc.customizekey2 = customizekey2;
    //     //         doc.customizeInfo2 = customizeInfo2;
    //     //         doc.customizekey3 = customizekey3;
    //     //         doc.customizeInfo3 = customizeInfo3;
    //     //
    //     //         doc.save();
    //     //     });
    //     // });
    //     // res.redirect("/user");
    //     // return;
    // }


    if(photo == null){
        if (!accountName || accountName == "") {
            textMessage = "Please enter your username";
            res.render('user/user-UD', {layout: 'user-page', message:textMessage, photo:photo});
            return;
        } else if (!password || password == "") {
            textMessage = "Please enter your password";
            res.render('user/user-UD', {layout: 'user-page', message:textMessage, photo:photo});
            return;
        } else if (password.length < 6) {
            textMessage = "Password too short! Must longer than 6 digits";
            res.render('user/user-UD', {layout: 'user-page', message:textMessage, photo:photo});
            return;
        }

        User.findOne({accountName:accountName}, function(err, result){
            if (err) {
                console.log('error occured in the database');
            }
            userInfo = result;
            var id = userInfo._id;

            User.findById(id, function(err, doc) {
                if (err) {
                    console.error('error, no user found');
                }
                let salt = bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(req.body.password, salt);
                doc.accountName = req.body.accountName;
                doc.password = hash;
                doc.photo = req.body.photo;
                doc.save();
            });
            var textMessage = "successfully changed the password!"
            res.clearCookie("Username");
            res.render('user/login', {layout: 'user-page', message:textMessage, photo:"../../resource/default.jpg"});
        });
    }else{
        var accountName = req.cookies["Username"];
        User.findOne({accountName:accountName}, function(err, result){
            if (err) {
                console.log('error occured in the database');
            }
            userInfo = result;
            var id = userInfo._id;

            User.findById(id, function(err, doc) {
                if (err) {
                    console.error('error, no user found');
                }
                doc.photo = req.body.photo;
                doc.save();
            });
            // var textMessage = "successfully changed the avatar!"
            res.redirect("/user");
            return;
        });
    }


};


//remain the ability to delete a user for future use;
var deleteUser = function(req, res, next) {
    var accountName = req.cookies["Username"];
    User.findOne({accountName:accountName}, function(err, result){
        if (err) {
            console.log('error occured in the database');
        }
        userInfo = result;
        var id = userInfo._id;
        User.findByIdAndRemove(id).exec();
        res.clearCookie("Username");
        res.redirect('/');
        return;
    });

};


//the functionality that allowed user to log in with their username and passord;
async function userLogin(req, res, next) {
    var accountName = req.body.accountName, password = req.body.password;

    // assert input from page
    if (!accountName || accountName == "") {
        res.render('user/login', {layout: "user-page", message: "Username can not be blank."});
        return false;
    } else if (!password || password == "") {
        res.render('user/login', {layout: "user-page", message: "Password can not be blank."});
        return false;
    }

    // compare input with records in db
    var userInfo;
    await User.findOne({accountName:accountName}, function(err, result) {
        if (err) {
            console.log('error occured in the database');
        }
        userInfo = result;


        if (userInfo == null) {
            res.render("user/login", {layout: "user-page", message:"Unregistered username. Please sign up"});
            return;
        }
        let saltFromHash = userInfo.password.substr(0, 29);
        let newHash = bcrypt.hashSync(password, saltFromHash);
        if (newHash.localeCompare(userInfo.password) == 0) { // login successful
            res.cookie("Username", accountName);
            res.redirect("/user");

        } else {
            res.render('user/login', {layout: "user-page", message: "Incorrect password. Please try again."});
        }
    });



    //Something wrong here, maybe async things.

    // if (userInfo == null) {
    //     res.render("user/login", {layout: "user-page", message:"Unregistered username. Please sign up"});
    //
    // } else if (password.localeCompare(userInfo.password) == 0) { // login successful
    //     res.cookie("Username", accountName);
    //     res.redirect("/user");
    //
    // } else {
    //     res.render('user/login', {layout: "user-page", message: "Incorrect password. Please try again."});
    // }

    return true;
}

//let user log out and clear the cookies;
function userLogout(req, res, next) {
    if(req.cookies["Username"] == null){
        res.redirect('../user/login');
    }else{
        res.clearCookie("Username");
        res.redirect("/");
    }

}


var updateImage = function(req, res, next){
    var image = req.body.photos;
    var description = req.body.imageDescription;
    var accName = req.cookies["Username"];

    if(image == null || image == ""){
        textMessage = "Please choose at least one image ";
        res.send(textMessage+'<a href = "/edit-myfolio">Go Back</a>');
        return ;
    }

    if(description == null || description == ""){
        textMessage = "Please add some description to your image ";
        res.send(textMessage+'<a href = "/edit-myfolio">Go Back</a>');
        return ;
    }

    if(accName != null){
        var accName = req.cookies["Username"];
        if(image != null && image != ""){
             User.findOne({accountName:accName}, function(err, result){
                if (err) {
                    console.log('error occured in the database');
                }
                var userInfo = result;
                var id = userInfo._id;

                 User.findById(id, function(err, doc) {
                    if (err) {
                        console.error('error, no user found');
                    }
                    doc.image.push({file: image, description: description});
                    doc.save();
                    res.redirect("/edit-myfolio");
                });

            });
        }


    }

}

var updateMyPhoto = function(req, res, next) {
    var photo = req.body.myPhoto;
    var accName = req.cookies["Username"];

    if (photo == null || photo == "") {
        textMessage = "Please choose a photo of yourself! ";
        res.send(textMessage + '<a href = "/edit-myfolio">Go Back</a>');
        return;
    }

    if (accName != null) {
        var accName = req.cookies["Username"];
        if (photo != null && photo != "") {
            User.findOne({accountName: accName}, function (err, result) {
                if (err) {
                    console.log('error occured in the database');
                }
                result.myPhoto = photo;
                result.save();
            })
        }
        res.redirect("/edit-myfolio");
    }
}


var delPDF = async function(req, res,next) {
    var accountName = req.cookies["Username"];
    var id = req.body.id;
    await User.findOne({accountName: accountName}, function (err, result) {

        Info = result;
        for(var i = 0; i < Info.PDF.length; i++){

            if (Info.PDF[i].id == id){
                Info.PDF.remove(id);
                result.save();
                res.redirect("/edit-myfolio");
            }
        }
    });
};


var delImage = async function(req, res,next) {
    var accountName = req.cookies["Username"];
    var id = req.body.id;
    await User.findOne({accountName: accountName}, function (err, result) {

        Info = result;
        for(var i = 0; i < Info.image.length; i++){

            if (Info.image[i].id == id){
                Info.image.remove(id);
                result.save();
                res.redirect("/edit-myfolio");
            }
        }
    });
};


var updateDescription = async function(req, res,next) {
    var accountName = req.cookies["Username"];
    var id = req.body.id;
    var description = req.body.newDescription;
    var type = req.body.PDFType;

    if (description == null || description == ""){
        textMessage = "Description can not be empty!";
        res.send(textMessage+'<a href = "/edit-myfolio">Go Back</a>');
        return ;
    }

    await User.findOne({accountName: accountName}, function (err, result) {
        Info = result;
        if (type != null) {
            for (var i = 0; i < Info.PDF.length; i++) {
                if (Info.PDF[i].id == id) {
                    Info.PDF[i].description = description;
                    result.save();
                    res.redirect("/edit-myfolio");
                }
            }
        }
        else{

            for (var i = 0; i < Info.image.length; i++) {
                if (Info.image[i].id == id) {
                    Info.image[i].description = description;
                    result.save();
                    res.redirect("/edit-myfolio");
                }
            }
        }
    });
};


var rosteringTime = function(req, res, next) {
    var startTime = req.body.startTime;
    var endTime = req.body.endedTime;
    var accName = req.body.accname1;
    var specialized = req.body.specialized;
    var numOfStudent = req.body.numOfStudent;
    var totalmoney = req.body.totalmoney;
    var statu = req.body.statu;
    var cancelReason = req.body.cancelReason;

    if (accName != null) {
        var accName = req.body.accname1;
        User.findOne({accountName: accName}, function (err, result) {
            if (err) {
                console.log('error occured in the database');
            }
            result.startTime = startTime;
            result.endedTime = endTime;
            result.specialized = specialized;
            result.numOfStudent = numOfStudent;
            result.totalmoney = totalmoney;
            result.statu = statu;
            result.cancelReason = cancelReason;
            result.save();

            if(statu == "Yes"){
                var nodemailer2 = require ("nodemailer");
                let transport = nodemailer2.createTransport({
                    host:"smtp.163.com",
                    secureConnection : true,
                    port: 465,
                    secure: true,
                    auth:{
                        user: 'spmtest2021@163.com',
                        pass: 'DPSSYJVCYFRCNCPF'
                    }
                });
                transport.sendMail({
                    from: '"Coder" <spmtest2021@163.com>',
                    to: '<spmtest2021@163.com>',
                    subject: "Bus Cancellation",
                    text:"Expression of interest acceptance ID: " +req.body.acceptanceId + "\n"+ "School Name："+req.body.fname + "\n"+
                        "Address: " + req.body.lname + "\n" +"School Type: " + req.body.schooltype + "\n" +
                        "Start date: " + req.body.startTime + "\n" + "End date: " + req.body.endedTime +
                        "\n" +"Participate in specialized activities?  " + req.body.specialized + "\n" +
                        "Total Students Participating: " + req.body.numOfStudent + "\n" +
                        "Cost per student: $30" + "\n" + "Total cost: " + req.body.totalmoney + "\n" +
                        "Reason for Cancellation: " + req.body.cancelReason
                    //html:"<h1> Hello World </h1><br>"
                });
            }



            if(req.cookies["Username"] == "administrator"){
                var nodemailer1 = require ("nodemailer");
                let transport = nodemailer1.createTransport({
                    host:"smtp.163.com",
                    secureConnection : true,
                    port: 465,
                    secure: true,
                    auth:{
                        user: 'spmtest2021@163.com',
                        pass: 'DPSSYJVCYFRCNCPF'
                    }
                });
                transport.sendMail({
                    from: '"Coder" <spmtest2021@163.com>',
                    to: req.body.accnaMe,
                    subject: "Time available",
                    text:"Expression of interest acceptance ID: " +req.body.acceptanceId + "\n"+ "School Name："+req.body.fname + ", "+
                        "Address: " + req.body.lname + ", " +"School Type: " + req.body.schooltype + "\n" +
                        "Start date: " + req.body.startTime + "\n" + "End date: " + req.body.endedTime
                    //html:"<h1> Hello World </h1><br>"
                });
            }

            console.log(req.cookies["Username"]);
        })

        res.redirect("/");
    }
}

module.exports.findAllUsers = findAllUsers;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.userLogin = userLogin;
module.exports.userLogout = userLogout;
module.exports.delPDF = delPDF;
module.exports.updateUserInfo = updateUserInfo;
module.exports.updatePDF = updatePDF;
module.exports.updateDescription = updateDescription;
module.exports.updateImage = updateImage;
module.exports.delImage = delImage;
module.exports.updateMyPhoto = updateMyPhoto;
module.exports.rosteringTime = rosteringTime;
