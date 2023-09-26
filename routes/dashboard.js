const isAdmin = require("../middleware/isAdmin");

const prisma = require("../config/database");
const router = require("express").Router();
const upload = require("../middleware/upload");
const getShopcart = require("../utils/shopcart");
const categoryTemplate = require("../enums/categoryTemplate");
const DashboardPostController = require("../controllers/dashboardPost");
const DashboardBannerController = require("../controllers/dashboardBanner");
const DashboardProductController = require("../controllers/dashboardProduct");

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
router.get("/posts", DashboardPostController.list);
router.post("/posts", upload("posts").single("image"), DashboardPostController.create);
router.get("/posts/:id", DashboardPostController.getOne);
router.put("/posts", upload("posts").single("image"), DashboardPostController.update);
router.delete("/posts/:id", DashboardPostController.delete);

// Product
router.get("/products", DashboardProductController.list);
router.post("/products", upload("products").array("images", 10), DashboardProductController.create);
router.get("/products/:id", DashboardProductController.getOne);
router.put("/products", upload("products").array("images", 10), DashboardProductController.update);
router.delete("/products/:id", DashboardProductController.delete);
router.delete("/products/:id/images/:idImage", DashboardProductController.deleteImage);
router.put("/products/:id/images/:idImage", upload("products").single("image"), DashboardProductController.updateImage);

// Banners
router.get("/banners", DashboardBannerController.list);
router.put("/banners/images", upload("banners").single("image"), DashboardBannerController.updateImage);

module.exports = router;
