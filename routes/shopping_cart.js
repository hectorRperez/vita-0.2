const prisma = require("../config/database");
const getShopcart = require("../utils/shopcart");

const router = require("express").Router();

router.get("/", async function (req, res) {
  console.log(req.session);
 // console.log(req.sessionID);
  const user = req.isAuthenticated() ? req.user : { name: "unknown"} ;
  console.log(user);
  const car =  await getShopcart(req);
  return res.render("shopping_cart", { car, user });
});


router.get("/delete/:id" , async function (req, res) {
  await prisma.shopcartItem.delete({ where: { id: req.params.id }})
  return res.redirect("/shopping_cart/");
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
      if(item) return res.redirect("/shopping_cart");
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
      if(item) return res.redirect("/shoping_cart");
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
      return res.redirect("/shop/" + body.productId);
    }
    res.send(200);
  }
});

module.exports = router;
