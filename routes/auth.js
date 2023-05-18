const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { ArtistModel } = require("../models/artist_model");
const passport = require('passport');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/signup", async (req,res) => {
  const { username, email, password } = req.body
  if (username && email && password) {
    const hashedPass = await bcrypt.hash(password, 10)
    const user = new ArtistModel()
    user.username = username
    user.password = hashedPass
    user.email = email

    try {
      await user.save()
      res.send("Authentication successful")
    } catch (err) {

      let erroMsg = "Internal Server Error"
      let { message } = err

      if (message.includes("duplicate")){
        if (message.includes("username"))
          erroMsg = "Username already exists"

        if (message.includes("email"))
          erroMsg = "Email already exists"
      }
      
      console.log(err.message);
      res.status(500).send(erroMsg)
    }

  }
})

router.post("/login", passport.authenticate('local', {
  successRedirect: "/auth/success",
}))

router.get('/success', (req, res) =>{
  res.send("Auth successfull")
})
module.exports = router;
