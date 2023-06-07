const { User } = require("../../models/user");
const { Track } = require("../../models/track");
const { requestErr } = require("../../utils/functions");
const fs = require("fs");
const passport = require("passport");
const router = require("express").Router();

router.post("/share", async (req, res) => {
    try {
        const { trackId, visitorId } = req.body;
        try {
            let track  = await Track.findById(trackId).exec()
            track.shares.push(visitorId)
            track.save()
            res.send({msg: "Share added to track"})
        } catch (e) {
          console.log(e);
          console.log("Could not write file");
        }
      } catch (err) {
        console.log(err);
        res.status(500).json(requestErr("Something went wrong"));
      }
});

router.post("/play",  async (req, res) => {
  try {
    const { trackId, visitorId } = req.body;
    try {
        let track  = await Track.findById(trackId).exec()
        track.plays.push(visitorId)
        track.save()
        res.send({msg: "Play added to track"})
    } catch (e) {
      console.log(e);
      console.log("Could not write file");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(requestErr("Something went wrong"));
  }
});
router.post("/like", passport.authenticate("jwt"),   async (req, res) => {
  try {
    const { trackId } = req.body;

    if (!req.user)  res.status(401).json(requestErr("Login or signup to like"));
    try {
        const { user } = req
        let track  = await Track.findById(trackId).exec()

        if (track.likes.indexOf(user.id) == -1) track.likes.push(user.id)
        else track.likes = track.likes.filter(it => it !== user.id)
        
        await track.save()
        res.send({msg: "Play added to track"})
    } catch (e) {
      console.log(e);
      console.log("Could not write file");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(requestErr("Something went wrong"));
  }
});

router.post('/', passport.authenticate("jwt"), async (req, res)=>{
  const { id } = req.query
  let {
    title,
    album, 
    release_date,
    allow_free_download,
    description,
    is_beat,
    is_demo,
    price,
    collabos,
    tags,
    genre,
  } = req.body;
  if (id){
    let track = await Track.findById(id).exec()
    if (!track) return res.status(404).json({ msg: "Track not found"})

    track.title = title;
    track.price = parseFloat(price);
    track.album = album;
    track.description = description;
    track.allow_free_download = allow_free_download;
    track.genre = genre;
    track.collabos = collabos.split(",");
    track.tags = tags.split(",");
    track.is_beat = is_beat == 'false' ? false: true;
    track.is_demo = is_demo == 'false' ? false: true;
    track.release_date = release_date;

    try {
      await track.save();
      return res.status(200).json({ trackId: track.id });
    } catch (e) {
      console.log("Could not save track model");
      console.log(e);
      res.status(500).json(requestErr());
    }
  }
  else{
    res.status(400).json({ msg: "Gotta provide track ID"})
  }
})
module.exports = router;
