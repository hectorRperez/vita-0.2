const router = require("express").Router();

const getShopcart = require("../utils/shopcart");

// ruta inicial
router.get("/privacy_policies", async (req, res) => {
  try {
    const car = await getShopcart(req);

    res.render("privacy_policies.ejs", {
      user: req.user,
      car,
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
