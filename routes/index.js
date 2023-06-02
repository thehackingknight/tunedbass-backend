const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../utils/functions')
const { Track } = require("../models/track")
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/check-types", (req, res)=>{
  let track = Track.findOne({}).exec()
  for (let field in track){
    console.log(field);
  }
  res.json({})
})
module.exports = router;
