let express = require("express");
let router = express.Router();
const dotenv = require("dotenv");
const multer = require("multer");
const { User } = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcrypt");

dotenv.config();

router.post(
  "/edit",
  passport.authenticate("jwt"),
  multer().none(),
  async (req, res) => {
    try {
      const { username, email, password, account_type, address, bio } =
        req.body;

      const { user } = req;

      if (await bcrypt.compare(password, user.password)) {
        if (address) user.address = address;
        if (bio) user.bio = bio;
        user.username = username;
        user.email = email;
        user.account_type = account_type;
        await user.save()
        return res.send("Account modified");
      } else {
        return res.status(401).json({ msg: "Password incorrect" });
      }
      
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Something went wrong" });
    }
  }
);
module.exports = router;
