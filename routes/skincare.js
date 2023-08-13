const prisma = require("../config/database");
const getShopcart = require("../utils/shopcart");

const router = require("express").Router();

// ruta que se carga de traer los productos
router.get("/skincare", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
      },
      take: 4,
    });

    const productsWithImage = products.map((product) => {
      let image = null;
      image = product.images.filter((image) => image.isFirst)[0] ?? null;

      image = !image && product.images.length > 0 ? product.images[0] : image;
      const images = product.images.filter((element) => image != element);
      return {
        ...product,
        images,
        image,
      };
    });

    const car = await getShopcart(req);

    res.render("skincare", { products: productsWithImage, user: req.user, car });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
