const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { ArtistModel } = require("../models/artist_model");
const passport = require('passport');
const multer = require('multer');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('auth/login', { title: 'Express' });
});

router.get('/check', async (req, res)=>{
  let isAuthenticated = req.isAuthenticated();

  if (isAuthenticated){
  req.user.then(usr=>{
    res.json({user: usr})
  })}
  else { res.status(401).send('UNAUTHORIZED')}
})
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

router.post("/login", passport.authenticate('local'), (req, res)=>{
  res.send("AUTH SUCCESSFUL!")
})

router.post("/logout", (req, res)=>{
  if (req.user){
    req.logOut(err=>{
      if (err) return res.status(500).json(requestErr())
       res.send("LOGOUT SUCCESSFUL!")
    })
 }
 else {
  res.send("You was not even logged in hommie!")
 }
})

module.exports = router;
