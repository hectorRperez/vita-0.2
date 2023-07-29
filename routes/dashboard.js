const isAdmin = require("../middleware/isAdmin");

const prisma = require("../config/database");
const router = require("express").Router();
const upload = require("../middleware/upload");
const getShopcart = require("../utils/shopcart");
const postSchema = require("../schemas/post");
const categoryTemplate = require("../enums/categoryTemplate");

router.use(isAdmin);

// ruta inicial
router.get("/", async (req, res) => {
  try {
    const car = await getShopcart(req);

    res.render("dashboard", { car, user: req.user });
  } catch (error) {
    console.error(error);
  }
});

// Users
router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    const car = await getShopcart(req);
    res.render("dashboard/users", { users: users, car, user: req.user });
  } catch (error) {
    console.error(error);
  }
});

// Categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    const car = await getShopcart(req);

    return res.render("dashboard/categories", {
      categories: categories,
      car,
      user: req.user,
      templates: categoryTemplate,
      templates_keys: Object.keys(categoryTemplate)
    });
  } catch (error) {
    console.error(error);
  }
});

router.post("/categories", async (req, res) => {
  if (req.body.name) {
    const category = await prisma.category.create({
      data: {
        name: req.body.name,
        template: req.body.template,
      },
    });

    return res.status(200).send({
      message: "Category created successfully",
      data: category,
      code: 201,
    });
  }

  return res.status(400).send({
    message: "Bad request",
    data: req.body,
  });
});

// Posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    const car = await getShopcart(req);
    res.render("dashboard/posts", {
      posts,
      user: req.user,
      car,
    });
  } catch (error) {
    console.error(error);
  }
});

router.post("/posts", async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.user);
    const postData = await postSchema.validateAsync(req.body,
      { allowUnknown: true,
        stripUnknown: true
      });
    const post  = await prisma.post.create({
      data: {
        ...postData,
        userId: req.user.id,
      }
    });
    return res.json({
      data: post,
      message: "Sucessfully created post",
      status: 200,
    });
  } catch (error) {
    console.error(error);
  }
});

// Product
router.get("/products", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    const products = await prisma.product.findMany();
    const car = await getShopcart(req);
    res.render("dashboard/products", {
      categories,
      products: products,
      user: req.user,
      car,
    });
  } catch (error) {
    console.error(error);
  }
});

router.post("/products", upload.array("images", 10), async (req, res) => {
  const body = req.body;
  const files = req.files;

  try {
    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: parseFloat(body.price),
        description: body.description,
        quantity: parseInt(body.quantity),
        size: body.size,
        keyBenefits: body.keyBenefits,
        howUse: body.howUse,
        ingredients: body.ingredients,
        caution: body.caution,
        categoryId: body.categoryId,
      },
    });

    // defino las imagenes del producto
    if (files)
      for (let i = 0; i < files.length; i++) {
        let image = `/img/products/${files[i].filename}`;
        await prisma.productImages.create({
          data: {
            productId: product.id,
            image: image,
            isFirst: false,
          },
        });
      }

    res.status(201).send({
      data: product,
      message: "Product created successfully",
      code: 201,
    });
  } catch (error) {
    res.status(400).send({
      data: error,
      status: 400,
      message: error.message,
    });
  }
});

module.exports = router;
