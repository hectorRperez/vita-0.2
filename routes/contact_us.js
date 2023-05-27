const router = require("express").Router();

// ruta inicial
router.get("/contact", (req, res) => {
  try {
    res.render("contact_us.ejs");
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
