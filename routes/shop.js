const router = require("express").Router();
const prisma = require("../config/database");
const isAuth = require("../middleware/isAuth");
const getShopcart = require("../utils/shopcart");

router.get("/shop", async (req, res) => {
  try {

    const products = await prisma.product.findMany({
      include: {
        images: true,
        descriptions: true,
      },
    });
    if (!products) return res.send(404);
    const car = await getShopcart(req);
    console.log(products);

    res.render("view_products", {
      user: req.user,
      car,
      products,
      products_related: [],
    });
  } catch (error) {
    console.error(error);
    return res.send(400);
  }
});

router.get("/shop/:product_id?", async (req, res) => {
  try {
    const { product_id } = req.params;
    const car = await getShopcart(req);
    const product = await prisma.product.findUnique({
      where: {
        ...(product_id && { id: product_id }),
      },
      include: {
        images: true,
        descriptions: true,
      },
    });
    if (!product) return res.send(404);

    const relatedProducts = await prisma.product.findMany({
      where: {
        NOT: {
          id: product.id,
        },
        categoryId: product.categoryId,
      },
      include: {
        images: true,
      },
    });

    res.render("view_product", {
      user: req.user,
      product: product,
      car,
      product_images: product.images,
      products_related: relatedProducts,
    });
  } catch (error) {
    console.error(error);
    return res.send(400);
  }
});

module.exports = router;
