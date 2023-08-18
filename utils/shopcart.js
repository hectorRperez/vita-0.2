const prisma = require("../config/database");

const getShopcart = async (req) => {
  let shopcart = { items: [] };

  if (req.isAuthenticated()) {
    shopcart = await prisma.shopcart.findFirst({
      where: {
        userId: req.user.id,
        isPaid: false,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!shopcart) {
      shopcart = createShopcart(req);
    }
  } else {
    shopcart = await prisma.shopcart.findFirst({
      where: {
        sessionId: req.sessionID,
        isPaid: false,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!shopcart)
      shopcart = await prisma.shopcart.create({
        data: { sessionId: req.sessionID },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
        },
      });
  }

  return shopcart;
};

async function createShopcart(req) {
  return await prisma.shopcart.create({
    data: { userId: req.user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });
}

module.exports = getShopcart;
