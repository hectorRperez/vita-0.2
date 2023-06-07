const router = require("express").Router();
const { RenderProduct } = require("../config/render-view");
const prisma = require("../config/database");

// ruta que se carga si el usuario ha iniciado sesion
router.get(
  "/shop/:product_id?",
  async (req, res) => {
    try {

      if (req.params.product_id) product_id = req.params.product_id;

      const product = await prisma.product.findOne({
        where: {
          id: product_id,
        },
        include: {
          images: true,
          descriptions: true,
        },
      });

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

      const view = RenderProduct(product);

      console.log(product);

      res.render(view, {
        user: req.user,
        product: product,
        product_images: product.images,
        products_related: relatedProducts,
      });
    } catch (error) {
      console.error(error);
    }
  }
);

module.exports = router;
