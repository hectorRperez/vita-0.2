const path = require("path");
const fs = require("fs");

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
        status: 201,
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

  getOne = async (req, res) => {
    try {
      const id = req.params.id;
  
      const post = await prisma.post.findUnique({
        where: {
          id
        },
        include: {
          createdBy: true,
        },
      });
  
      res.status(200).send({
        data: post,
        message: "Post it was obtained successfully",
        code: 200,
      });
    } catch (error) {
      console.error(error);
    }
  }

  update = async (req, res) => {
    try {
      const body = req.body;
      const file = req.file;
      const id = body.id;

      // Validate
      const postData = await postSchema.validateAsync(
        body,
        {
          allowUnknown: true,
          stripUnknown: true
        }
      );

      const postOld = await prisma.post.findUnique({
        where: {
          id
        }
      });

      // File
      let image = null;

      if (file) {
        image = `/img/posts/${file.filename}`;

        if (postOld.image) {
          if (fs.existsSync(path.join("public/", postOld.image))) {
            fs.unlinkSync(path.join("public/", postOld.image));
          }
        }
      }

      // Update
      const post = await prisma.post.update({
        where: {
          id
        },
        data: {
          ...postData,
          userId: req.user.id,
          image
        },
      });

      return res.json({
        data: post,
        message: "Sucessfully updated post",
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

  delete = async (req, res) => {
    try {
      const id = req.params.id;

      const deletePost = await prisma.post.delete({
        where: {
          id
        },
      });

      // Delete file
      if (deletePost.image) {
        if (fs.existsSync(path.join("public/", deletePost.image))) {
          fs.unlinkSync(path.join("public/", deletePost.image));
        }
      }

      res.status(200).send({
        message: "Product deleted successfully",
        code: 200,
      });
    } catch (error) {
      res.status(400).send({
        data: error,
        status: 400,
        message: error.message,
      });
    }
  }
}

module.exports = new DashboardPostController();
