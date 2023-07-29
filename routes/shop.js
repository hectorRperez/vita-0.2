const router = require("express").Router();
const prisma = require("../config/database");
const getShopcart = require("../utils/shopcart");

router.get("/shop", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        descriptions: true,
      },
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
    if (!productsWithImage) return res.send(404);
    const car = await getShopcart(req);

    res.render("view_products", {
      user: req.user,
      car,
      products: productsWithImage,
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
        category: true,
        descriptions: true,
      },
    });

    let image = null;
    if (product.images)
      image = product.images.filter((image) => image.isFirst)[0] ?? null;

    image = !image && product.images.length > 0 ? product.images[0] : image;
    const images = product.images.filter((element) => image != element);

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

    const relatedProductsWithImages = relatedProducts.map((product) => {
      let imageR = null;
      imageR = product.images.filter((image) => image.isFirst)[0] ?? null;

      imageR =
        !imageR && product.images.length > 0 ? product.images[0] : imageR;
      const images = product.images.filter((element) => imageR != element);
      return {
        ...product,
        images,
        image: imageR,
      };
    });

    const template = product.category.template.toLocaleLowerCase().replace('_', '-');

    res.render(`shop/${template}`, {
      user: req.user,
      product: product,
      car,
      image,
      product_images: images,
      relatedProducts: relatedProductsWithImages,
    });
  } catch (error) {
    return res.send(400);
  }
});

module.exports = router;
