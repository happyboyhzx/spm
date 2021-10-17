require('dotenv').config();
var mongoose = require('mongoose');
// const uri = process.env.CONNECTION_URL;
const uri = CONNECTION_URL = "mongodb+srv://spmuser:spmusers@cluster0.znhuw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(uri,
    function(err){
    if(!err){
        console.log('Connected to mongo.');
    }else{
        console.log('Failed to connect to mongo!', err);
    }
});

require('./user.js');
require('./discussion.js');
