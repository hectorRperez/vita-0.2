const prisma = require("../config/database");
const getShopcart = require("../utils/shopcart");

const router = require("express").Router();

router.get("/", async function (req, res) {
  console.log(req.session);
  // console.log(req.sessionID);
  const user = req.isAuthenticated() ? req.user : { name: "unknown" };
  console.log(user);
  const car = await getShopcart(req);
  return res.render("shopping_cart", { car, user });
});

router.get("/delete/:id", async function (req, res) {
  await prisma.shopcartItem.delete({ where: { id: req.params.id } });
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
  if (body.quantity > product.quantity) return res.send("maximo permitido");

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
    },
  });
  return res.redirect("/shopping_cart");
});

module.exports = router;
