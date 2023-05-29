const router = require("express").Router();

// ruta inicial
router.get("/privacy_policies", (req, res) => {
  try {
    res.render("privacy_policies.ejs");
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
