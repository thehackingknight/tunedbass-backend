var express = require("express");
var https = require("https");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
var router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", async (req, res)=>{

  let file = path.join(__dirname, "TheTemple.mp3")
  let url = "https://res.cloudinary.com/sketchi/video/upload/v1684820950/TunedBass/Tonics/audio/TB_The%20temple-by-Tonics-1684820922718-777722907.mp3"
  try {
    //let stream = fs.createReadStream(file)
    
    https.get(url, (stream)=>{

     /*  stream.on("data", data=>{
      res.write(data)
    }) 

    stream.on('error', () => {
      res.sendStatus(404);
    }); */
  stream.pipe(res)
    stream.on('end', () => {
      res.end();
    });
    })
    

  } catch (err) {
    console.log(err);
    res.status(500).send('ERA')
  }
})

module.exports = router