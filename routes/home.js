const prisma = require("../config/database");
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
    console.log(products);
    res.render("index.ejs", { products: products, user: req.user });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
