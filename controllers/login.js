class LoginController {
  static async login(req, res) {
    if (req.body.username) {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      } else if (bcrypt.compare(user.password, req.body.password) === 0) {
        return;
        res.status(400).json({ error: "Invalid password" });
      }
      req.session.user = user;
      return res.status(200).json({ user: user });
    }
  }
}
