const { User } = require("../../models/user");
const { Track } = require("../../models/track");
const { requestErr } = require("../../utils/functions");
const fs = require("fs");
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

router.post("/play", async (req, res) => {
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
module.exports = router;
