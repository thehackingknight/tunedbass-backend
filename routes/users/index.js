const router = require("express").Router();
const { ArtistModel } = require("../../models/artist_model");
const { TrackModel } = require("../../models/track_model");
const { requestErr} = require("../../utils/functions")
router.get("/", async (req, res) => {
  const { username } = req.query;

  let data;
  if (username) {
    data = await ArtistModel.findOne({ username }).exec();
    if (!data) return res.status(404).json(requestErr("User with specified username not found"))
    let tracks = [];
    let plays = 0, likes = 0, shares = 0;
    for (let trackId of data.tracks) {
        
      let track = await TrackModel.findById(trackId).exec();
      plays += track.plays.length;
      likes += track.likes.length;
      shares += track.shares.length;
      track = { ...track.toObject(), id: track.id, artist: data.toObject() };
      tracks.push(track)
    }
    data = { ...data.toObject(), id: data.id, tracks, plays, likes, shares };
  } else {
    data = await ArtistModel.find().exec();
    data = data.map((it) => {
      return { ...it.toObject(), id: it.id };
    });
  }

  res.status(200).json({ data: data });
});

router.post("/delete", async (req, res) => {
  const { username } = req.body;
  ArtistModel.findOneAndRemove({ username }).then((user) => {
    if (user) {
      // Delete tracks uploaded by this user
      user.tracks.forEach((it) => {
        TrackModel.findByIdAndRemove(it).then((r) => {
          if (r) console.log("Removed Track: " + r.title);
        });
      });

      res.status(200).send(user.username + " deleted!");
    } else res.status(400).send("User not found");
  });
});

module.exports = router;
