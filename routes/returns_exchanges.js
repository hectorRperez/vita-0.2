const getShopcart = require("../utils/shopcart");

const router = require("express").Router();

// ruta inicial
router.get("/returns_exchanges", async (req, res) => {
  const user = req.user ?? { name: "unknown" };
  const car = await getShopcart();
  try {
    res.render("returns_exchanges.ejs", { user, car });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
