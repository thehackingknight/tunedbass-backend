const express = require("express");
const router = express.Router();
const modifyRouter = require("./modify");
const uploadRouter = require("./upload");
const downloadRouter = require("./download");
const { Track } = require("../../models/track");
const { User } = require("../../models/user");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const { configCloudinary, requestErr } = require("../../utils/functions");

const path = require("path");
const https = require("https");
const request = require("request");

const { default: axios } = require("axios");
const cors = require("cors");
const { statSync, createReadStream } = require("fs");

router.get("/ep/:endpoint", async (req, res) => {
  const { endpoint } = req.params;
  const { ref } = req.query;

  if (endpoint == "related") {
    try {
      let refTrack = await Track.findById(ref).exec();
      let tagsRegex = refTrack?.tags.map((tag) => new RegExp(tag.trim()));
      let tracks = await Track.find({
        tags: {
          $in: tagsRegex,
        },
      }).exec();
 
      if (!refTrack)
        return res.status(404).json(requestErr("Reference track not found"));
      tracks = tracks.filter((it) => it.id !== refTrack.id);
      let data = [];
      for (let track of tracks) {
        let artist = await User.findById(
          track?.artist.toString()
        ).exec();
        if (!artist?.username) {
          continue;
        }

        let hashedURL = jwt.sign({url:track?.url}, process.env.SECRET_KEY);

        data.push({
          ...track?.toObject(),
          artist: artist.toJSON(),
          //url: hashedURL,
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
const corsOptions = {
  headers: [
    { key: "Access-Control-Allow-Credentials", value: "true" },
    { key: "Access-Control-Allow-Origin", value: "*" },
    // ...
  ],
};
router.get("/", async (req, res) => {
  const { id } = req.query;
  console.log("GEYS");
  let tracks;
  try {
    if (id) {
      let track = await Track.findById(id).exec();
      tracks = [track];
      if (!track) {
        return res.status(404).json(requestErr("Track not found"));
      }
    } else {
      tracks = await Track.find().exec();
    }
  } catch (e) {
    console.log(e);

    return res.status(500).send("Something went wrong");
  }

  let data = [];

  try {
    for (let track of tracks) {
      let artist = await User.findById(track?.artist.toString()).exec();
      if (!artist?.username) {
        continue;
      }

      let hashedURL = jwt.sign({url: track?.url}, process.env.SECRET_KEY, { algorithm: "HS256"});

      data.push({
        ...track?.toObject(),
        artist: artist.toJSON(),
        //url: hashedURL,
        id: track?.id,
        tags: track?.tags.filter((tag) => tag),
      });
    }

    res.json({ tracks: data });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});
router.post("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    let track = await Track.findById(id).exec();
    if (track) {
      await Track.findOneAndRemove({}).exec();
      console.log("Removed ", track.title);
      // Delete file from cloudinary
      configCloudinary();
      await cloudinary.uploader.destroy(track.public_id, {
        resource_type: "video",
      });
      // Removing from artist track list
      let artist = await User.findById(track.artist).exec();
      if (artist) {
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
    let { range } = req.headers;
    if (range) {
      // @ts-ignore
      url = jwt.verify(url, process.env.SECRET_KEY).replace("http:", "https:");
      console.log(url);
      let filePath = path.join(__dirname + "/tuned_temp/files/audio/TheTemple.mp3")
      let total = statSync(filePath).size//false ? 524288 : 12802159//Math.floor((1024*1024) / 12.2)
      
      const CHUNK_SIZE = 10 ** 6; // 1MB
      const parts = range.replace(/bytes=/, '').split('-');
      const partialStart = parts[0];
      const partialEnd = parts[1];
      //const start = !range ? 0 : parseInt(range.replace(/\D/g, ""));
      //const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
      const start = parseInt(partialStart, 10);
      const end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
      const chunksize = (end - start) + 1;
      const rstream = createReadStream(filePath, {start: start, end: end});
      // Create headers
      const contentLength = (end - start) + 1;
      console.log(start, contentLength);
      const headers = {
          'Content-Range': 'bytes ' + start + '-' + end + '/' + total,                                   //"Content-Range": `bytes ${start}-${end}/${total}`,
                         'Accept-Ranges': 'bytes', 'Content-Length': chunksize,                                   //"Accept-Ranges": "bytes",
                         //'Content-Type': 'audio/mpeg'                                   //"Content-Length": contentLength,
      };

      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);
      //rstream.pipe(res)
      // @ts-ignore
      request.get(url).pipe(res)
      //https.get(url, (stream) => {
      //  stream.pipe(res);
      //  //stream.on("end", (_) => res.end());
      //});
    }
    else{
      console.log("No range");
      res.status(400).send("Provide range")
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(requestErr());
  }
});
router.use("/upload", uploadRouter);
router.use("/download", downloadRouter);
router.use("/modify", multer().none(), modifyRouter);
module.exports = router;
