const prisma = require("../config/database");

const getShopcart = async (req) => {
  let shopcart = { items: [] };
  if (req.isAuthenticated()) {
    if (req.user.car?.id)
      shopcart = await prisma.shopcart.findUnique({
        where: {
          id: req.user.car.id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    else
      shopcart = await prisma.shopcart.create({
        data: { userId: req.user.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
  } else {
    console.log("here");
    shopcart = await prisma.shopcart.findFirst({
      where: {
        sessionId: req.sessionID,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    console.log(shopcart);
    if (!shopcart)
      shopcart = await prisma.shopcart.create({
        data: { sessionId: req.sessionID },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
  }
  return shopcart;
};

module.exports = getShopcart;
