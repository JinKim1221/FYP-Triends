var express = require('express');
const path = require('path');
const app = express();
var router = express.Router();

const mongoose = require('mongoose');
const User = mongoose.model('users')


/* GET home page. */
router.get('/main', function(req, res, next) {
  res.render("triends_main",{
    title:'Find your travelmate!',
    users : req.body
  });
});



module.exports = router;