const router = require("express").Router();
const passport = require("passport");
const SignupController = require("../controllers/Signup");
const prisma = require("../config/database");
const UserType = require("@prisma/client").UserType;
// ruta que muestra el formulario de login
router.get("/login", (req, res) => {
  if(req.user?.type == "ADMIN") return res.redirect("/dashboard");
  if(req.user) return res.redirect("/shop");
  return res.render("login.ejs");
});

// ruta que se encarga de iniciar sesion
router.post(
  "/login",
  passport.authenticate("local"),
  function (req, res) {
    console.log(req.body);
    return res.json({
      user: req.user,
      redirect: req.user.type == UserType.ADMIN ? "/dashboard": "/shop",
    });
  }
);

// ruta para mostrar el formulario de registro de usuario
router.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

// ruta para mostrar el formulario de registro de usuario
router.post("/signup", SignupController.signup);

module.exports = router;
