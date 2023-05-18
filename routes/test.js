var express = require('express');
const { CarModel } = require('../models/models');
const { default: mongoose } = require('mongoose');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Research Facility");
});

router.post('/', async (req, res) =>{
   try{
   console.log(req.body);
    res.status(200).send("Car saved to db")
  }
  catch(err) {
    console.log(err);
    res.status(500).send("Something went wrong")
  }
})
module.exports = router;
 