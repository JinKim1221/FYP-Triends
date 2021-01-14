const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    user_fullname : {
        type : String, 
        required : "This field is required"
    },
    user_email : {
        type : String, 
        required : "This field is required", 
        unique : true
    },
    user_password : {
        type : String, 
        required : "This field is required"
    },
    user_confPassword : {
        type : String, 
        required: "This field is required"
    },
    register_time : {
        type:Date, 
        default:Date.now
    }
});



mongoose.model('users', userSchema);