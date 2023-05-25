const express = require("express");
const multer = require("multer");
const {
  requestErr,
} = require("../../utils/functions");
const { TrackModel } = require("../../models/track_model");
const { ArtistModel } = require("../../models/artist_model");

const router = express.Router();

router.get("/", function (req, res) {
  console.log(req.body);
  res.send("endpoint working");
});
let upload = multer()
router.post("/", upload.none(), async (req, res) => {
  let {
    title,
    album,
    release_date,
    duration,
    is_beat,
    is_demo,
    price,
    collabos,
    tags,
    genre,
    public_id,
    url
  } = req.body;


  if (req.user) {
    //if (true){
    try {
      req.user.then(async (user) => {
        //ArtistModel.findOne({ username: "Tonics" }).then(async (user) => {
        album = album ? album : "Single";
          // Save to db
          let track = new TrackModel();
          track.title = title;
          track.price = parseFloat(price).toFixed(2);
          track.artist = user.id.toString();
          track.album = album;
          track.genre = genre;
          track.collabos = collabos.split(",");
          track.tags = tags.split(",");
          track.is_beat = parseInt(is_beat);
          track.is_demo = parseInt(is_demo);
          track.duration = `${duration}`;
          track.release_date = release_date;
          track.url = url;
          track.public_id = public_id;
          try {
            user.tracks.push(track.id);
            await track.save();
            await user.save();
            return res.status(200).json({ trackId: track.id });
          } catch (e) {
            console.log("Could not save track model");
            console.log(e);
            res.status(500).json(requestErr());
          }
        
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(requestErr());
    }
  } else {
    // Not logged in
    res.status(401).json(requestErr("Login to upload stuff"));
  }

  /**/
});

module.exports = router;
