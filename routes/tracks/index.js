const express = require("express");
const router = express.Router();
const modifyRouter = require("./modify");
const uploadRouter = require("./upload");
const downloadRouter = require("./download");
const { TrackModel } = require("../../models/track_model");
const { ArtistModel } = require("../../models/artist_model");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const { configCloudinary, requestErr } = require("../../utils/functions");
// @ts-ignore
const path = require("path");
const https = require("https");
// @ts-ignore
const { default: axios } = require("axios");

router.get("/:endpoint", async (req, res) => {
  const { endpoint } = req.params;
  const { ref } = req.query;

  if (endpoint == "related") {
    try {    
      let refTrack = await TrackModel.findById(ref).exec()
      let tagsRegex = refTrack?.tags.map(tag => new RegExp(tag.trim()));
      let tracks = await TrackModel.find({
        tags: {
          $in: tagsRegex,
        },
        
      }).exec();

      if (!refTrack) return res.status(404).json(requestErr("Reference track not found"));
      tracks = tracks.filter(it=> it.id !== refTrack.id)
      let data = []
      for (let track of tracks) {
        let artist = await ArtistModel.findById(track?.artist.toString()).exec();
        if (!artist?.username) {
          continue;
        }
        // @ts-ignore
        let hashedURL = jwt.sign(track?.url, process.env.SECRET_KEY);
  
        data.push({
          ...track?.toObject(),
          artist: artist.toJSON(),
          url: hashedURL,
          id: track?.id,
        });
      }
      res.json({ tracks: data });
    } catch (e) {
      console.log(e);
      res.status(500).send("ERA");
    }
  }
});

router.get("/", async (req, res) => {
  // @ts-ignore
  const { id, kind } = req.query;
  let tracks;
  try {
    tracks = id
      ? [await TrackModel.findById(id).exec()]
      : await TrackModel.find().exec();
  } catch (e) {
    res.status(404).json(requestErr("Track not found"));
    return;
  }

  let data = [];

  try {
    for (let track of tracks) {
      let artist = await ArtistModel.findById(track?.artist.toString()).exec();
      if (!artist?.username) {
        continue;
      }
      // @ts-ignore
      let hashedURL = jwt.sign(track?.url, process.env.SECRET_KEY);

      data.push({
        ...track?.toObject(),
        artist: artist.toJSON(),
        url: hashedURL,
        id: track?.id,
      });
    }

    res.json({ tracks: data });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

router.post("/delete", multer().none(), async (req, res) => {
  const { id } = req.body;
  try {
    let track = await TrackModel.findById(id).exec();
    if (track) {
      await TrackModel.findOneAndRemove({}).exec();
      console.log("Removed ", track.title);
      // Delete file from cloudinary
      configCloudinary();
      await cloudinary.uploader.destroy(track.public_id, {
        resource_type: "video",
      });
      // Removing from artist track list
      let artist = await ArtistModel.findById(track.artist).exec();
      if (artist) {
        // @ts-ignore
        artist.tracks = artist.tracks.filter((it) => it !== track.id);
        artist.save();
      } else {
        console.log("Could not artist track with ID: ", track.artist);
      }
    } else {
      console.log("Could not find track with ID: ", id);
    }

    res.send("Done");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

router.get("/url", async (req, res) => {
  try {
    let { url } = req.query;
    // @ts-ignore
    url = jwt.verify(url, process.env.SECRET_KEY).replace("http:", "https:");
    // @ts-ignore
    https.get(url, (stream) => {
      stream.pipe(res);
      stream.on("end", (_) => res.end());
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(requestErr());
  }
});
router.use("/upload", uploadRouter);
router.use("/download", downloadRouter);
router.use("/modify", multer().none(), modifyRouter);
module.exports = router;
