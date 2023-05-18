const { ArtistModel } = require("../models/artist_model");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

const getUserByEmail = async (email) => {
  ArtistModel.findOne({ email });
};
const init = (passport) => {
  const authenticateUser = async (username, password, done) => {
    let userQuery = ArtistModel.findOne({ email: username });
    userQuery
      .then(async (user) => {
        if (user == null)
          return done(null, false, { message: "User not found" });

        try {
          console.log(user.password);
          if (await bcrypt.compare(password, user.password)) {
            console.log("Suceess");
            console.log(done);
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        } catch (err) {
          console.log(err);
          return done(err);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    /*
     */
  };
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    let userById = ArtistModel.findById(id);
    return done(null, userById);
  });
};
module.exports = init;
