const express = require("express");
const router = express.Router();
const uploadRouter = require("./upload");
const { TrackModel } = require("../../models/track_model");
const { ArtistModel } = require("../../models/artist_model");
router.get("/", async (req, res) => {
  let tracks = await TrackModel.find().exec();
  let data = []
  try {
    for (let track of tracks) {
      let artist = await ArtistModel.findById(track.artist.toString()).exec();
      if (!artist?.username) {continue}
      data.push({...track.toObject(), artist: artist.toJSON()})
    }

    res.json({ tracks: data });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }

});

router.use("/upload", uploadRouter);

module.exports = router;
