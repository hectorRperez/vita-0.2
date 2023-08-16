const Stripe = require("stripe");

const prisma = require("../config/database");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentController {
  static async createSession(req, res) {
    try {
      const shopcart = await prisma.shopcart.findFirst({
        where: {
          sessionId: req.sessionID,
          isPaid: false
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      const line_items = [];
      const errors = [];

      shopcart.items.forEach(item => {
        if (item.count > item.product.quantity) {
          errors.push({
            data: {
              id: item.id,
              size: item.size,
              product: {
                id: item.product.id,
                name: item.product.name,
                quantity: item.product.quantity
              }
            },
            message: `The requested quantity of the product ${item.product.name} is greater than the existing one. You can apply: ${item.product.quantity}`
          });
        } else {
          line_items.push({
            price_data: {
              product_data: {
                name: item.product.name,
              },
              currency: "usd",
              unit_amount: item.product.price * 100,
            },
            quantity: item.count,
          });
        }
      });

      if (errors.length > 0) {
        return res.status(400).json({
          errors
        });
      }

      // Create checkout sessions in stripe
      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${process.env.APP_URL}/shopping_cart/success/${shopcart.id}`,
        cancel_url: `${process.env.APP_URL}/shopping_cart`,
      });

      // Set Payment Session Id in shopcart
      await prisma.shopcart.update({
        where: {
          id: shopcart.id,
        },
        data: {
          paymentSessionId: session.id
        },
      });

      return res.json({ redirect: session.url });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: 'Internal error, please try again.' });
    }
  }

  static async success(req, res) {
    try {
      const shopcart = await prisma.shopcart.findFirst({
        where: {
          id: req.params.id,
          isPaid: false,
          paymentSessionId: {
            not: null
          }
        },
        include: {
          items: true,
        },
      });

      if (!shopcart) {
        return res.redirect("/shopping_cart");
      }

      // Create checkout sessions in stripe
      const session = await stripe.checkout.sessions.retrieve(shopcart.paymentSessionId);

      const name = session.customer_details.name;
      const email = session.customer_details.email;

      const transactions = [];

      // Actualizar las cantidades de los productos.
      shopcart.items.forEach(item => {
        const shopcartItemUpdate = prisma.product.update({
          where: {
            id: item.productId,
          },
          data: {
            quantity: {
              decrement: item.count
            }
          },
        });;

        transactions.push(shopcartItemUpdate);
      });


      // Indicate that it was paid
      const shopcartUpdate = prisma.shopcart.update({
        where: {
          id: shopcart.id,
        },
        data: {
          isPaid: true,
          nameClient: name,
          emailClient: email,
        },
      });

      transactions.push(shopcartUpdate);

      await prisma.$transaction(transactions);

      return res.redirect("/shopping_cart?payment=true");
    } catch (error) {
      console.log(error.message);
      return res.redirect("/shopping_cart?payment=false");
    }
  }
}

module.exports = PaymentController;
