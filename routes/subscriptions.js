const router = require("express").Router();

const SubscriptionController = require("../controllers/subscriptionController");

router.post("/subscriptions", SubscriptionController.create);
router.post("/subscriptions/validate", SubscriptionController.validate);

module.exports = router;
