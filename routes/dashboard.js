const path = require("path");
const fs = require("fs");

const isAdmin = require("../middleware/isAdmin");

const prisma = require("../config/database");
const router = require("express").Router();
const upload = require("../middleware/upload");
const getShopcart = require("../utils/shopcart");
const postSchema = require("../schemas/post");
const categoryTemplate = require("../enums/categoryTemplate");
const productLabel = require("../enums/productLabel");

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
    const postData = await postSchema.validateAsync(
      req.body,
      {
        allowUnknown: true,
        stripUnknown: true
      }
    );
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
    if (
      error?.details &&
      error.details.length > 0
    ) {
      return res.send(400, { success: false, message: error.details[0].message });
    }
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
      product_label: productLabel,
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const product = await prisma.product.findUnique({
      where: {
        id
      },
      include: {
        category: true,
        images: true,
      },
    });

    res.status(200).send({
      data: product,
      message: "Product it was obtained successfully",
      code: 200,
    });
  } catch (error) {
    console.error(error);
  }
});

router.post("/products", upload.array("images", 10), async (req, res) => {
  const body = req.body;
  const files = req.files;

  try {
    const sizes = body.sizes;
    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: parseFloat(body.price),
        description: body.description,
        quantity: parseInt(body.quantity),
        sizes,
        assessment: parseInt(body.assessment),
        keyBenefits: body.keyBenefits,
        howUse: body.howUse,
        ingredients: body.ingredients,
        caution: body.caution,
        weight: body.weight,
        dimensions: body.dimensions,
        categoryId: body.categoryId,
        label: body.label,
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

router.put("/products", upload.array("images", 10), async (req, res) => {
  const body = req.body;
  const files = req.files;
  const id = body.id

  try {
    const sizes = body.sizes;

    const product = await prisma.product.update({
      where: {
        id
      },
      data: {
        name: body.name,
        price: parseFloat(body.price),
        description: body.description,
        quantity: parseInt(body.quantity),
        sizes,
        assessment: parseInt(body.assessment),
        keyBenefits: body.keyBenefits,
        howUse: body.howUse,
        ingredients: body.ingredients,
        caution: body.caution,
        weight: body.weight,
        dimensions: body.dimensions,
        categoryId: body.categoryId,
        label: body.label,
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

    res.status(200).send({
      data: product,
      message: "Product updated successfully",
      code: 200,
    });
  } catch (error) {
    res.status(400).send({
      data: error,
      status: 400,
      message: error.message,
    });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const product = await prisma.product.findUnique({
      where: {
        id
      },
      include: {
        images: true,
        carItems: true,
      },
    });

    if (product.carItems.length) {
      return res.status(400).send({
        data: null,
        status: 400,
        message: 'This product exists in a shopping cart, it cannot be removed',
      });
    }

    const deleteProductImages = prisma.productImages.deleteMany({
      where: {
        productId: id,
      },
    });

    const deleteProduct = prisma.product.delete({
      where: {
        id
      },
    });

    await prisma.$transaction([deleteProductImages, deleteProduct]);

    // Delete file
    product.images.map(productImage => {
      if (fs.existsSync(path.join("public/", '/img/products/product-169144184062425.jpeg'))) {
        fs.unlinkSync(path.join("public/", productImage.image));
      }
    });

    res.status(200).send({
      message: "Product deleted successfully",
      code: 200,
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
