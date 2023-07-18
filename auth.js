const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const prisma = require("./config/database");

module.exports = (passport) => {
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async function (req, _email, _password, done) {
        const user = await prisma.user.findUnique({
          where: {
            email: req.body.email,
          },
        });
        console.log(req.body);
        if (!user) {
          return done("The user does not exist!", false);
        }
        try {	
          const match = await bcrypt.compareSync(req.body.password, user.password);
          if (match) {
            return done(null, user);
          } else {
            return done("null");
          }
        } catch (e) {
        
          return done(e);
        }
        
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { car: true },
    });
    done(null, user);
  });
};
