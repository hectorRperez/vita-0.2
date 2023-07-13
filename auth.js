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
        if (!user) {
          return done("El usuario no existe", false);
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
          return done("La contraseña no coincide", false);
        }
        done(null, user);
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
