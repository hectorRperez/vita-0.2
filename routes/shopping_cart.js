const prisma = require("../config/database");

const router = require("express").Router();

router.get("/", async function (req, res) {
  if (req.isAuthenticated()) {
    let shopcart = null;
    if(req.user.car?.id)
    shopcart = await prisma.shopcart.findUnique({
      where: {
        id: req.user.car.id,
      },
      include: { items: true },
    });
    if (!shopcart)
      shopcart = await prisma.shopcart.create({
        data: { userId: req.user.id },
        include: {
          items: true,
        },
      });
    return res.status(200).json(shopcart);
  }
  return res.send(200);
});

router.post("/add", async (req, res) => {
  const body = req.body;
  if (req.isAuthenticated()) {
    if (req.user.car) {
      const item = await prisma.shopcartItem.upsert({
        where:{
          carId_productId: {
          productId: body.product_id,
          carId: req.user.car.id,
        }},
        update:{
          count: parseInt(body.quantity),
        },
        create: {
          productId: body.product_id,
          count: parseInt(body.quantity),
          carId: req.user.car.id,
        }
      });
      console.log(item);
      if(item) return res.status(200).json(item);
    }else {
      const item = await prisma.shopcartItem.create({
        data: {
          productId: body.product_id,
          count: parseInt(body.quantity),
          carId: req.user.car.id,
          car: {
            create: {
              data: {
                userId: req.user.id,
              }
            }
          }
        },
      });
      if(item) return res.status(200).json(item);
    }
  } else {
    let sessionCar = prisma.shopcart.findFirst({
      where: {
        sessionId: req.sessionId,
      },
    });

    if (!sessionCar) {
      sessionCar = prisma.shopcart.create({ sessionId: req.sessionID });

      prisma.shopcartItem.upsert({
        data: {
          productId: body.product_id,
          count: parseInt(body.quantity),
          carId: sessionCar.id,
        },
      });
      return res.redirect("/shop" + body.productId);
    }
    res.send(200);
  }
});

module.exports = router;
