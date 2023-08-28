const router = require("express").Router();

const getShopcart = require("../utils/shopcart");

// ruta inicial
router.get("/returns_exchanges", async (req, res) => {
  try {
    const car = await getShopcart(req);

    res.render("returns_exchanges.ejs", {
      user: req.user,
      car,
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
