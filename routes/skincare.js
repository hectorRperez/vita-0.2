const prisma = require("../config/database");

const router = require("express").Router();

// ruta que se carga de traer los productos
router.get("/skincare", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
      },
    });

    res.render("skincare", { products: products, user: req.user });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
