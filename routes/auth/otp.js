const multer = require("multer");
const { OTP_Model } = require("../../models/models");
const { ArtistModel } = require("../../models/user");
const { genOTP, sendMail } = require("../../utils/functions");

const router = require("express").Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  let otp = await OTP_Model.findOne({user: id}).exec();
  if (!otp) return res.status(404).send("OTP NOT FOUND");

  res.send(`${otp.date_created}`);
});
router.get("/:id/request", async (req, res) => {
  const { id } = req.params;

  try {
    let user = await ArtistModel.findById(id).exec();
    if (!user) return res.status(404).send("OWNER NOT FOUND");

    let pin = await genOTP()
      let otp = new OTP_Model()
      otp.otp = pin;
      otp.user = user.id;
      otp.date_created = Date.now()
      await otp.save()
      
      let mail = ` <div>
      <h1>Thank you for signing up with TunedBass Music!</h1>
      <h3>Here is your one-time PIN.</h3>
      <p class="otp">${otp.otp}</p>
      <p>The PIN is <b>valid</b> for only <b>1 hour</b>.</p>
    </div>`
      let mailRes = await sendMail("TunedBass Music Signup", mail, user.email)
      if (!mailRes) return  res.status(500).json({ msg: "Something went wrong" });
      //SEND EMAIL
      res.send(otp.user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong")
  }
})
router.post("/verify", async (req, res) => {
  // Recieves the otp as well as otp id
  // If otp belongs to OTP(id) -> get the user and set is_verified -> true
  const { pin, id } = req.body;
  try{
    if (!pin || !id) return res.status(400).json({ msg: "Provide PIN and ID " });
  let otp = await OTP_Model.findOne({user: id}).exec();
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
  }catch(e){
    console.log(e);
    res.status(500).json({ msg: "Something went wrong" });
  }
  
});
module.exports = router;
