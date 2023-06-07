const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const connection = require("./config/connection");
const prisma = require("./config/database");
const { UserType } = require("@prisma/client");

module.exports = (passport) => {
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async function (req, email, password, done) {
        // si el usuario esta registrandose
        if (req.body.signup != null) {
          if (req.body.password != req.body.password_confirm) {
            done("Las contraseñas no coinciden", false);
          }

          // encrypto la contraseña
          bcrypt.hash(req.body.password, 10, async function (err, hash) {
            if (err) throw done(err.sqlMessage, false);
            try {
              const user = await prisma.user.create({
                data: {
                  name: req.body.name,
                  lastname: req.body.lastname,
                  email: req.body.email,
                  password: hash,
                  type: UserType.ADMIN,
                },
              });
              if (user)
                done(`Usuario ${user?.email} registrado correctamente.`, true);
            } catch (error) {
              done(error.sqlMessage, false);
            }
          });

          // si el usuario esta iniciando sesion
        } else if (req.body.login != null) {
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
      }
    )
  );

  // serializacion de un usuario
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // deserializacion de un usuario
  passport.deserializeUser(async (id, done) => {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { car: true },
    });
    done(null, user);
  });
};
