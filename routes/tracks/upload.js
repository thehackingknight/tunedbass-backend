const express = require('express');
const router = express.Router();
/* GET home page. */
router.post('/', function(req, res) {
  console.log(req.body);
  res.send('endpoint working')
});

module.exports = router;
