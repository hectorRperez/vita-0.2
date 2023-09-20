const prisma = require("../config/database");

class SubscriptionController {
  create = async (req, res) => {
    try {
      const email = req.body.email;

      // Validate
      const existDiscountSubscription = await prisma.discountSubscription.findFirst({
        where: {
          email
        }
      });

      if (existDiscountSubscription) {
        return res.status(400).json({
          success: false,
          message: 'A subscription already exists'
        });
      }

      // Create
      const discountSubscription = await prisma.discountSubscription.create({
        data: {
          email
        }
      });

      return res.json({
        data: discountSubscription,
        message: "Successfully created subscription",
        status: 201,
      });
    } catch (error) {
      if (
        error?.details &&
        error.details.length > 0
      ) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }
    }
  }

  validate = async (req, res) => {
    try {
      const email = req.body.email;

      // Validate
      const discountSubscription = await prisma.discountSubscription.findFirst({
        where: {
          email,
          used: false
        }
      });

      if (!discountSubscription) {
        return res.status(400).json({
          success: false,
          message: 'You do not have a subscription or I have already used your discount percentage. You must continue your payment without discount.'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Congratulations, you can use the discount. Please continue with your payment.'
      });
    } catch (error) {
      if (
        error?.details &&
        error.details.length > 0
      ) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }
    }
  }
}

module.exports = new SubscriptionController();
