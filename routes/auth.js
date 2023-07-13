const router = require("express").Router();
const passport = require("passport");
const SignupController = require("../controllers/Signup");
// ruta que muestra el formulario de login
router.get("/login", (req, res) => {
  res.render("login.ejs");
});

// ruta que se encarga de iniciar sesion
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    if (req.user.type === "ADMIN") return res.redirect("/dashboard");
    else return res.redirect("/shop");
  }
);

// ruta para mostrar el formulario de registro de usuario
router.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

// ruta para mostrar el formulario de registro de usuario
router.post("/signup", SignupController.signup);

module.exports = router;
