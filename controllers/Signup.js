const prisma = require("../config/database");
const UserSchema = require("../schemas/user");
const bcrypt = require("bcrypt");

class SignupController {
  static async signup(req, res) {
    try {
      if (req.body.password === req.body.password_confirm) {
        const userData = await UserSchema.validateAsync(req.body, {
          allowUnknown: true,
          stripUnknown: true,
        });
        const password = await bcrypt.hash(req.body.password, 10);
        const user = await prisma.user.create({
          data: { ...userData, password, type: "ADMIN" },
        });

        return res.json({
          status: 200,
          message: "User created successfully",
          data: user,
          redirect: 'login',
        });
      } else throw "Passwords does not match";
    } catch (e) {
      return res.send(401, { success: false, message: typeof e === 'string' ? e : null });
    }
  }
}
module.exports = SignupController;
