/* MongoDB - mongoose */
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mydb',
{
  useNewUrlParser : true,
  useUnifiedTopology : true
}, (err)=>{
    if(!err){
        console.log("MongoDB Connection Succeeded");
    }
    else{
        console.log("Error in DB connection : "+ err);
    }
});

require('./users.model');
