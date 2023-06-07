const express = require("express");
const multer = require("multer");
const {
  requestErr, deleteTrack,
} = require("../../utils/functions");
const { Track } = require("../../models/track");
const { User } = require("../../models/user");
const passport = require("passport");

const router = express.Router();

router.get("/", function (req, res) {
  console.log(req.body);
  res.send("endpoint working");
});
let upload = multer()
router.post("/",passport.authenticate("jwt"), upload.none(), async (req, res) => {
  let {
    title,
    album, 
    release_date,
    duration,
    description,
    is_beat,
    is_demo,
    price,
    collabos,
    tags,
    genre,
    public_id,
    size_in_bytes,
    url
  } = req.body;


  if (req.user) {
    //if (true){
    try {
        const { user } = req
      //User.findOne({ username: "Tonics" }).then(async (user) => {
        album = album ? album : "Single";
          // Save to db
          let track = new Track();
          track.title = title;
          track.price = parseFloat(price);
          track.artist = user.id.toString();
          track.album = album;
          track.description = description;
          track.genre = genre;
          track.collabos = collabos.split(",");
          track.tags = tags.split(",");
          track.is_beat = parseInt(is_beat) == 0 ? false: true;
          track.is_demo = parseInt(is_demo) == 0 ? false: true;
          track.duration = `${duration}`;
          track.release_date = release_date;
          track.url = url;
          track.public_id = public_id;
          track.size_in_bytes = parseFloat(size_in_bytes);
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
        
    } catch (err) {

      // Delete track from cloudinary
      try{
        await deleteTrack(public_id)
      }
      catch(e){
        console.log("Failed to delete track from cloudinary")
        console.log(e)
      }
      console.log(err);
      res.status(500).json(requestErr());
    }
  } else {
    try{
      await deleteTrack(public_id)
    }
    catch(e){
      console.log("Failed to delete track from cloudinary")
      console.log(e)
    }
    // Not logged in
    res.status(401).json(requestErr("Login to upload stuff"));
  }

  /**/
});

module.exports = router;
