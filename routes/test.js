const { default: axios } = require('axios');
const Cryptr = require('cryptr');
let express = require('express');
let dotenv = require('dotenv');
let router = express.Router();
dotenv.config()
let cryptr = new Cryptr(process.env.SECRET_KEY)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Research Facility");
});
router.get("/enc", async (req, res)=>{

  try{
    let data = {
      name: "John",
      surname: "Doe"
    }
  res.json(data)
  }
  catch(err){
    console.log(err);
    res.status(500).json({})
  }
  
})
module.exports = router;
  