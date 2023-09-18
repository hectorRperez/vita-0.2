const prisma = require("../config/database");
const getShopcart = require("../utils/shopcart");
const PaymentController = require("../controllers/payment");

const router = require("express").Router();

router.get("/", async function (req, res) {
  const user = req.isAuthenticated() ? req.user : { name: "unknown" };
  const car = await getShopcart(req);
  let applyDiscount = false;
  let totalPay = 0;

  car.items.forEach(item => {
    totalPay += item.count * item.product.price;

    if (totalPay >= 40) {
      applyDiscount = true;
    }
  });

  return res.render(
    "shoppingCart/index", {
      car,
      user,
      payment: req.query?.payment ?? null,
      applyDiscount
    }
  );
});

router.get("/delete/:id", async function (req, res) {
  const shopcartItem = await prisma.shopcartItem.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      car: true
    },
  });

  if (
    shopcartItem &&
    shopcartItem?.car?.isPaid === false
  ) {
    await prisma.shopcartItem.delete({
      where: {
        id: req.params.id
      }
    });
  }

  return res.redirect("/shopping_cart/");
});

router.post("/add", async (req, res) => {
  const body = req.body;

  const car = await getShopcart(req);
  const product = await prisma.product.findUnique({
    where: {
      id: req.body.product_id,
    },
  });
  if (body.quantity > product.quantity) return res.status(301).send({
    message: "Limit quantity of product",
  });

  await prisma.shopcartItem.upsert({
    where: {
      carId_productId: {
        productId: body.product_id,
        carId: car.id,
      },
    },
    update: {
      count: parseInt(body.quantity),
    },
    create: {
      productId: body.product_id,
      count: parseInt(body.quantity),
      carId: car.id,
      size: body.size,
    },
  });

  return res.json({
    message: "Product added successfully",
    data: car
  });
});

// Payment
router.post("/payment", PaymentController.createSession);
router.get("/success/:id", PaymentController.success);

module.exports = router;
