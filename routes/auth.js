const router = require("express").Router();
const passport = require("passport");
/* const SignupController = require("../controllers/Signup"); */
const UserType = require("@prisma/client").UserType;
// ruta que muestra el formulario de login
router.get("/login", (req, res) => {
  if(req.user?.type == "ADMIN") return res.redirect("/dashboard");
  if(req.user) return res.redirect("/shop");
  return res.render("login.ejs");
});

// ruta que se encarga de iniciar sesion
router.post("/login", function (req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (err) {
      return sendAuthenticationFailed(res);
    }

    // Generate a JSON response reflecting authentication status
    if (! user) {
      return sendAuthenticationFailed(res);
    }

    req.login(user, function(err) {
      if (err) {
        return sendAuthenticationFailed(res);
      }

      return res.json({
        user: req.user,
        redirect: req.user.type == UserType.ADMIN ? "/dashboard": "/shop",
        success: true,
        message: 'Authentication succeeded'
      });
    });
  })(req, res, next);
});

function sendAuthenticationFailed(res) {
  return res.send(401, { success: false, message: 'Authentication failed' });
}

// ruta para mostrar el formulario de registro de usuario
/* router.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

// ruta para mostrar el formulario de registro de usuario
router.post("/signup", SignupController.signup); */

module.exports = router;
