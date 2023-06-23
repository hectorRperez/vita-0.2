const prisma = require("../config/database");
const getShopcart = require("../utils/shopcart");
const router = require("express").Router();

// ruta inicial
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
      },
      take: 4,
    });
    console.log(req.sessionID);

    const car =  await getShopcart(req);
    console.log(car);
    res.render("index.ejs", { products: products, user: req.user, car });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
