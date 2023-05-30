const multer = require("multer");
const { OTP_Model } = require("../../models/models");
const { ArtistModel } = require("../../models/artist_model");

const router = require("express").Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  let otp = await OTP_Model.findById(id).exec();
  if (!otp) return res.status(404).send("OTP NOT FOUND");

  res.send(otp.date_created);
});
router.post("/verify", multer().none(), async (req, res) => {
  // Recieves the otp as well as otp id
  // If otp belongs to OTP(id) -> get the user and set is_verified -> true
  const { pin, id } = req.body;

  if (!pin || !id) return res.status(400).json({ msg: "Provide PIN and ID " });
  let otp = await OTP_Model.findById(id).exec();
  if (!otp) return res.status(404).send("OTP NOT FOUND");

  if (otp.otp == pin) {
    let user = await ArtistModel.findById(otp.user).exec();
    if (!user) return res.status(404).send("USER NOT FOUND");
    user.is_verified = true;
    user.date_modified = new Date()
    await user.save()
    await OTP_Model.findByIdAndRemove(id).exec()
    res.send("SUCCESS")
  }
  else {
    res.status(400).json({ msg: "INCORRECT OTP " });
  }
});
module.exports = router;
