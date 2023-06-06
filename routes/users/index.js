const router = require("express").Router();
const { User } = require("../../models/user");
const { Track } = require("../../models/track");
const { requestErr} = require("../../utils/functions")
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const { username } = req.query;

  let data; 
  if (username) {
    data = await User.findOne({ username }).exec();
    if (!data) return res.status(404).json(requestErr("User with specified username not found"))
    let tracks = [];
    let plays = 0, likes = 0, shares = 0;
    for (let trackId of data.tracks) { // Clean up each track
        
      let track = await Track.findById(trackId).exec();
      plays += track.plays.length;
      likes += track.likes.length;
      shares += track.shares.length;
      //let hashedURL = jwt.sign(track.url, process.env.SECRET_KEY);
      track = { ...track.toObject(), id: track.id, artist: data.toObject() };
      tracks.push(track)
    }
    data = { ...data.toObject(), id: data.id, tracks, plays, likes, shares };
  } else {
    data = await User.find().exec();
    data = data.map((it) => {
      return { ...it.toObject(), id: it.id };
    });
  }

  res.status(200).json({ data: data });
});

router.post("/delete", async (req, res) => {
  const { username } = req.body;
  User.findOneAndRemove({ username }).then((user) => {
    if (user) {
      // Delete tracks uploaded by this user
      user.tracks.forEach((it) => {
        Track.findByIdAndRemove(it).then((r) => {
          if (r) console.log("Removed Track: " + r.title);
        });
      });

      res.status(200).send(user.username + " deleted!");
    } else res.status(400).send("User not found");
  });
});

module.exports = router;
