const isAdmin = require("../middleware/isAdmin");

const prisma = require("../config/database");
const router = require("express").Router();

router.use(isAdmin);

// ruta inicial
router.get("/", (req, res) => {
  try {
    res.render("dashboard");
  } catch (error) {
    console.error(error);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.render("dashboard/users", { users: users });
  } catch (error) {
    console.error(error);
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    return res.render("dashboard/categories", { categories: categories });
  } catch (error) {
    console.error(error);
  }
});

router.post("/categories", async (req, res) => {
  if (req.body.name) {
    const category = await prisma.category.create({
      data: {
        name: req.body.name,
      },
    });
    const categories = await prisma.category.findMany();
    console.log(categories);
    return res.render("dashboard/categories", { categories: categories });
  }
});

router.get("/products", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    const products = await prisma.product.findMany();
    res.render("dashboard/products", { categories, products: products });
  } catch (error) {
    console.error(error);
  }
});

router.post("/products", async (req, res) => {
  const body = req.body;
  const files = req.files;
  try {
    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: parseFloat(body.price),
        description: body.description,
        quantity: parseInt(body.quantity),
        categoryId: body.categoryId,
      },
    });

    // defino las imagenes del producto
    if (files)
      for (let i = 0; i < files.length; i++) {
        let image = `img/${files[i].filename}`;
        prisma.productImages.create({
          data: {
            product_id: product.id,
            image: image,
          },
        });
      }
    const categories = await prisma.category.findMany();
    const products = await prisma.product.findMany();
    res.render("dashboard/products", { categories, products });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
