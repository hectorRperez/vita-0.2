const { UserType } = require("@prisma/client");

module.exports = function (req, res, next) {
  if (req.isAuthenticated() && req.user?.type === UserType.ADMIN) {
    return next();
  }
  res.redirect("/login");
};
