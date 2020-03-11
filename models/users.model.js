const mongoose = require('mongoose');
// const bcrypt = require('b')
var userSchema = new mongoose.Schema({
    user_fullname : {
        type : String, 
        required : "This field is required"
    },
    user_email : {
        type : String, 
        required : "This field is required", 
        unique:true
    },
    user_password : {
        type : String, 
        required : "This field is required",
        minlength :[8,'Password must be at least 8 character long']
    },
    user_confPassword : {
        type : String, 
        required: "This field is required"
    },
    user_gender : {
        type : String, 
        required: "This field is required"
    },
    user_smoker : {
        type : String
    },
    user_kindness : {
        type : Number, 
        default:'0'
    },
    user_talkative : {
        type : Number, 
        default:'0'
    },
    user_outgoing : {
        type : Number, 
        default:'0'
    },
    user_humerous : {
        type : Number, 
        default:'0'
    },
    user_active : {
        type : Number, 
        default:'0'
    },   
    user_moreInfo : {
        type : String
    },
    user_Pref_gender : {
        type : String
    },
    user_Pref_smoker : {
        type : String
    },
    user_Pref_kindness : {
        type : Number, 
        default:'0'
    },
    user_Pref_talkative : {
        type : Number, 
        default:'0'
    },
    user_Pref_outgoing : {
        type : Number, 
        default:'0'
    },
    user_Pref_humerous : {
        type : Number, 
        default:'0'
    },
    user_Pref_active : {
        type : Number, 
        default:'0'
    },
    user_moreInfo : {
        type : String
    },
    register_time : {
        type:Date, 
        default:Date.now
    }
});

userSchema.path('user_email').validate((val)=>{
    emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    return emailRegex.test(val);
}, 'Invalid email');


mongoose.model('users', userSchema);