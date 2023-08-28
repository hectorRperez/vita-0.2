const prisma = require("../config/database");
const getShopcart = require("../utils/shopcart");
const postSchema = require("../schemas/post");

class DashboardPostController {
  list = async (req, res) => {
    try {
      const posts = await prisma.post.findMany();
      const car = await getShopcart(req);

      res.render("dashboard/posts", {
        posts,
        user: req.user,
        car,
      });
    } catch (error) {
      console.error(error);
    }
  }

  create = async (req, res) => {
    const file = req.file;

    try {
      // Validate
      const postData = await postSchema.validateAsync(
        req.body,
        {
          allowUnknown: true,
          stripUnknown: true
        }
      );

      // File
      const image = `/img/posts/${file.filename}`;

      // Create
      const post = await prisma.post.create({
        data: {
          ...postData,
          userId: req.user.id,
          image
        }
      });

      return res.json({
        data: post,
        message: "Sucessfully created post",
        status: 200,
      });
    } catch (error) {
      if (
        error?.details &&
        error.details.length > 0
      ) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }
    }
  }
}

module.exports = new DashboardPostController();
