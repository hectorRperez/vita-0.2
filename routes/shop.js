const router = require("express").Router();
const prisma = require("../config/database");

router.get("/shop", async (req, res) => {
  try {
    const { product_id } = req.params;

    const products = await prisma.product.findMany({
      include: {
        images: true,
        descriptions: true,
      },
    });
    if (!products) return res.send(404);

    console.log(products);

    res.render("view_products", {
      user: req.user,
      product: products,
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

    console.log(product);

    res.render("view_product", {
      user: req.user,
      product: product,
      product_images: product.images,
      products_related: relatedProducts,
    });
  } catch (error) {
    console.error(error);
    return res.send(400);
  }
});

module.exports = router;
