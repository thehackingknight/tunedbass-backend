const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User } = require("../models/user");
const passport = require("passport");
const multer = require("multer");
const jwt = require('jsonwebtoken')
const otpRouter = require("./auth/otp");
const { genOTP, sendMail } = require("../utils/functions");
const { OTP_Model } = require("../models/models");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", function (req, res, next) {
  res.render("auth/login", { title: "Express" });
});

router.get("/check", passport.authenticate("jwt"), async (req, res) => {
  let isAuthenticated = req.isAuthenticated();
  if (isAuthenticated) {
      res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ msg: "Incorrect credentials" });
  }
});

router.post("/signup", async (req, res) => {
  const { username, email, password, account_type, address } = req.body;
  if (username && email && password) {

    let userWithSameCredentials = await User.findOne({ username, email}).exec()
    if (userWithSameCredentials && !userWithSameCredentials.is_verified) {
      await User.findByIdAndDelete(userWithSameCredentials.id).exec()
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = new User();
    user.username = username;
    if (address) user.address = address
    user.password = hashedPass;
    user.email = email;
    user.account_type = account_type;

    try {
      await user.save();
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
      let erroMsg = "Internal Server Error";
      let { message } = err;

      if (message.includes("duplicate")) {
        if (message.includes("username")) erroMsg = "Username already exists";

        if (message.includes("email")) erroMsg = "Email already exists";
      }

      console.log(err.message);
      res.status(500).json({ msg: erroMsg });
    }
  }
});

router.post("/login", async (req, res)=>{
  try{

    const { email, password} = req.body
    let user = await User.findOne({ email }).exec()
    if (!user) return res.status(401).json({ msg: "No user found with the specified email"})
    console.log(user.username)
    if (await bcrypt.compare(password, user.password)) {
     let token = jwt.sign({id: user.id, exp: Date.now() + (24 * 60 * 60 *1000)}, process.env.SECRET_KEY)
      return res.send(token)
    } else {
      return res.status(401).json({ msg: "Password incorrect" });
    }
  }catch(e){  
    console.log(e);
    res.status(500).json({msg: "Something went wrong"})
  }
}
);

router.post("/logout", (req, res) => {
  if (req.user) {
    req.logOut((err) => {
      if (err) return res.status(500).json(requestErr());
      res.send("LOGOUT SUCCESSFUL!");
    });
  } else {
    res.send("You was not even logged in hommie!");
  }
});

router.use("/otp", otpRouter)
module.exports = router;
