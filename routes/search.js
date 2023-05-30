const express = require("express");
const router = express.Router();
const { TrackModel } = require("../models/track_model");
const { checkAuthenticated, requestErr } = require("../utils/functions");
const { ArtistModel } = require("../models/artist_model");
/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const { q } = req.query;

    let tracks = await TrackModel.find({
      tags: { $in: [new RegExp(`${q}`)]},
    }).exec();
    tracks = tracks.concat(await TrackModel.find({
      title: { $regex: q },
    }).exec())

    let artists = [] 
    let _tracks = [];
    let _artists = [];

    for (let track of tracks) {
      let artist = await ArtistModel.findById(track.artist).exec();
      _tracks.push({
        ...track.toObject(),
        artist: { ...artist.toObject(), id: artist.id },
        id: track.id,
      });
    }
    for (let artist of artists) {
      _artists.push({ ...artist.toObject(), id: artist.id });
    }
    let data = {
      tracks: _tracks,
      artists: _artists,
    };
    res.json(data);
  } catch (e) {
    console.log(e);
    res.status(500).json(requestErr());
  }
});

module.exports = router;
