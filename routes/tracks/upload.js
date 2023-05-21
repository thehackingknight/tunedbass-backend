const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { genUID } = require("../../utils/functions");
const { TrackModel } = require("../../models/track_model");
const { ArtistModel } = require("../../models/artist_model");
const cloudinary = require("cloudinary").v2;

const router = express.Router();
function configCloudinary() {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./temp/files/audio/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = genUID();
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const upload = multer({ storage });
const uploadToCloudinary = async (file) => {
  configCloudinary()
  try {
    const filePath = file.path;
    const public_id = `TB-${file.originalName}-${genUID()}`;
    const _res = await cloudinary.uploader.upload(filePath, {
      public_id,
      folder: "TunedBass/audio",
      resource_type: "video",
    });
    return _res.secure_url;
  } catch (err) {
    console.log("Line 41");
    console.log(err);
    return null;
  }
};

const removeFile = (path) => {
  setTimeout(() => {
    fs.unlink(path, (err) => {
      if (err) console.log("COULD NOT REMOVE FILE", err);
    });
  }, 0);
};
/* GET home page. */
router.get("/", function (req, res) {
  console.log(req.body);
  res.send("endpoint working");
});
/* GET home page. */
router.post("/", upload.single("file"), async (req, res) => {
  let { title, album, release_date, duration } = req.body;

  if (true) {
    //req.user.then(async (user) => {
    ArtistModel.findOne({ username: "Tonics" }).then(async (user) => {
      album = album ? album : "Single";

      // Upload the file

      let _res = await uploadToCloudinary(req.file);
      if (_res) {
        // Upload successful
        //delete file
        removeFile(req.file.path);
        // Save to db
        let track = new TrackModel();
        track.title = title;
        track.artist = user;
        track.album = album;
        track.duration = `${duration}`;
        track.release_date = release_date;
        track.url = _res;
        try {
          user.tracks.push(track);
          await track.save();
          await user.save();
          return res.status(200).json({ trackId: track.id });
        } catch (e) {
          console.log("Could not save track model");
          console.log(e);
          res.status(500).send("Something went wrong");
        }
      } else {
        removeFile(req.file.path);
        console.log("line 89");
        // Upload failed
        res.status(500).send("Something went wrong");
      }
    });
  } else {
    // Not logged in
    res.status(401).send("Login to upload stuff");
  }

  /**/
});

module.exports = router;
