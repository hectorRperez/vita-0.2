const Stripe = require("stripe");
const sgMail = require("@sendgrid/mail");
const path = require("path");
const ejs = require("ejs");

const prisma = require("../config/database");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class PaymentController {
  createSession = async (req, res) => {
    const email = req.body.email;
    let applyDiscount = false;

    try {
      let condictionWhere = { sessionId: req.sessionID };

      if (req.isAuthenticated()) {
        condictionWhere = { userId: req.user.id, };
      }

      const shopcart = await prisma.shopcart.findFirst({
        where: {
          ...condictionWhere,
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
      let totalPay = 0;

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
          totalPay += item.count * item.product.price;
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

      // Discount
      let discounts = [];
      const discountSubscription = await prisma.discountSubscription.findFirst({
        where: {
          email,
          used: false
        }
      });

      if (discountSubscription && totalPay >= process.env.APPLY_DISCOUNT_FOR_THE_AMOUNT_OF) {
        applyDiscount = true;

        const coupon = await stripe.coupons.create({
          percent_off: 15,
          duration: 'once',
        });

        discounts = [{
          coupon: coupon.id,
        }];

        await prisma.shopcartDiscountSubscription.create({
          data: {
            shopcartId: shopcart.id,
            discountSubscriptionId: discountSubscription.id
          }
        });
      }

      // Create checkout sessions in stripe
      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${process.env.APP_URL}/shopping_cart/success/${shopcart.id}`,
        cancel_url: `${process.env.APP_URL}/shopping_cart`,
        billing_address_collection: 'required',
        phone_number_collection: {
          enabled: true,
        },
        discounts,
      });

      // Set Payment Session Id in shopcart
      await prisma.shopcart.update({
        where: {
          id: shopcart.id,
        },
        data: {
          paymentSessionId: session.id,
          applyDiscount
        },
      });

      return res.json({ redirect: session.url });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: 'Internal error, please try again.' });
    }
  }

  success = async (req, res) => {
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
        return res.redirect("/shopping_cart");
      }

      // Create checkout sessions in stripe
      const session = await stripe.checkout.sessions.retrieve(shopcart.paymentSessionId);

      const name = session.customer_details.name;
      const email = session.customer_details.email;
      const phone = session.customer_details.phone;
      const address = {
        city: session.customer_details.address.city,
        country: session.customer_details.address.country,
        line1: session.customer_details.address.line1,
        line2: session.customer_details.address.line2,
        postalCode: session.customer_details.address.postal_code,
        state: session.customer_details.address.state,
      };

      // Create
      await prisma.paymentShopcart.create({
        data: {
          name: name,
          email: email,
          phone: phone,
          city: address.city,
          country: address.country,
          line1: address.line1,
          line2: address.line2,
          postalCode: address.postalCode,
          state: address.state,
          shopcartId: shopcart.id
        }
      });

      const transactions = [];

      // Discount
      if (shopcart.applyDiscount) {
        const shopcartDiscountSubscription = await prisma.shopcartDiscountSubscription.findFirst({
          where: {
            shopcartId: shopcart.id
          }
        });

        if (shopcartDiscountSubscription) {
          const discountSubscriptionUpdate = prisma.discountSubscription.update({
            where: {
              id: shopcartDiscountSubscription.discountSubscriptionId,
            },
            data: {
              used: true
            },
          });

          transactions.push(discountSubscriptionUpdate);
        }
      }

      let totalPaid = 0;
      let items = [];

      // Actualizar las cantidades de los productos.
      shopcart.items.forEach(item => {
        totalPaid += item.product.price * item.count;

        items.push({
          name: item.product.name,
          quantity: item.count,
          amount: item.product.price * item.count,
          size: item.size,
          image: item.product.images[0].image,
        });

        const shopcartItemUpdate = prisma.product.update({
          where: {
            id: item.productId,
          },
          data: {
            quantity: {
              decrement: item.count
            }
          },
        });

        transactions.push(shopcartItemUpdate);
      });

      // Indicate that it was paid
      const shopcartUpdate = prisma.shopcart.update({
        where: {
          id: shopcart.id,
        },
        data: {
          isPaid: true
        },
      });

      transactions.push(shopcartUpdate);

      await prisma.$transaction(transactions);

      // Send email
      // Customer
      this.sendEmailPurchaseMade({
        to: email,
        templateFile: "purchase_made_for_customer",
        templateData: {
          totalPaid,
          items,
        }
      });
      // Admin
      this.sendEmailPurchaseMade({
        to: process.env.SENDGRID_FROM,
        templateFile: "purchase_made_for_admin",
        templateData: {
          totalPaid,
          items,
          customer: name,
          email,
          phone,
          address,
          applyDiscount: shopcart.applyDiscount
        }
      });

      return res.redirect("/shopping_cart?payment=true");
    } catch (error) {
      console.log(error.message);
      return res.redirect("/shopping_cart?payment=false");
    }
  }

  sendEmailPurchaseMade = (data) => {
    const {
      to,
      templateFile,
      templateData
    } = data;
    let emailTemplate;

    ejs
      .renderFile(path.join(__dirname, `../views/template/email/${templateFile}.ejs`), {
        url: process.env.APP_URL,
        ...templateData,
      })
      .then(result => {
        emailTemplate = result;

        const msg = {
          to,
          from: process.env.SENDGRID_FROM,
          subject: process.env.SENDGRID_SUBJECT,
          html: emailTemplate,
        };
    
        sgMail
          .send(msg)
          .then((response) => {
            console.log(response[0].statusCode)
          })
          .catch((error) => {
            console.error(error?.response?.body)
          });
      });
  }
}

module.exports = new PaymentController();
