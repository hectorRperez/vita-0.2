const router = require("express").Router();

const prisma = require("../config/database");
const getShopcart = require("../utils/shopcart");
const productLabel = require("../enums/productLabel");

// ruta inicial
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          name: {
            equals: 'serum',
            mode: 'insensitive'
          }
        }
      },
      include: {
        images: true,
        category: true
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

    res.render("index.ejs", {
      products: productsWithImage,
      user: req.user,
      car,
      product_label: productLabel
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
