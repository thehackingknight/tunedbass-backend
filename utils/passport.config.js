const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const init = (passport) => {
  const authenticateUser = async (username, password, done) => {
    let userQuery = User.findOne({ email: username });
    userQuery
      .then(async (user) => {
        if (user == null) return done(null, false, { msg: "User not found" });
        if (!user.is_verified)
          return done(null, false, { msg: "User not verified" });

        try {
          if (await bcrypt.compare(password, user.password)) {
            console.log("Suceess");
            return done(null, user);
          } else {
            return done(null, false, { msg: "Password incorrect" });
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

  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.SECRET_KEY;
  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        const user = await User.findById(jwt_payload.id).exec();
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
          // or you could create a new account
        }
      } catch (e) {
        return done(e, false);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    let userById = User.findById(id);
    return done(null, userById);
  });
};
module.exports = init;
