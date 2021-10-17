var express = require('express');
var router = express.Router();

var userController = require('../../controllers/user-controller.js');

/* GET users listing. */
router.get('/', function(req, res) {
    if (req.cookies["Username"] == null) {
        res.render('user/sign-up', {
            layout: 'user-page',
            title: "Sign-up Page"
        });
    } else {
        res.redirect("/user");
    }

});

router.get('/get-data', userController.findAllUsers);

router.post('/insert', userController.createUser);

router.post('/update', userController.updateUser);

router.post('/delete', userController.deleteUser);

router.post('/deletePDF',userController.delPDF);

router.post('/updateUserInfo',userController.updateUserInfo);

router.post('/updatePDF',userController.updatePDF);

router.post('/updateDescription',userController.updateDescription);

router.post('/updateImage',userController.updateImage);

router.post('/deleteImage',userController.delImage);

router.post('/updateMyPhoto',userController.updateMyPhoto);

router.post('/updateTime', userController.rosteringTime);

module.exports = router;
