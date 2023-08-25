const router = require("express").Router();

const getShopcart = require("../utils/shopcart");

// ruta inicial
router.get("/terms_of_services", async (req, res) => {
  try {
    const car = await getShopcart(req);

    res.render("terms_of_services.ejs", {
      user: req.user,
      car,
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
