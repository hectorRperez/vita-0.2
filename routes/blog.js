const router = require("express").Router();

const prisma = require("../config/database");
const getShopcart = require("../utils/shopcart");

// ruta inicial
router.get("/blog", async (req, res) => {
  try {
    let posts = await prisma.post.findMany({
      include: {
        createdBy: true,
      },
    });

    posts = posts.map(post => {
      const createdAt = new Date(post.created_at)

      let month = createdAt.getMonth() + 1;
      if (month < 10) month = `0${month}`;

      post.created_at = `${month}/${createdAt.getDate()}/${createdAt.getFullYear()}`;

      return post;
    });

    const car = await getShopcart(req);

    res.render("blog.ejs", {
      posts: posts,
      user: req.user,
      car
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/blog/:id", async (req, res) => {
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

    if (!post) {
      return res.redirect("/blog");
    }

    const createdAt = new Date(post.created_at)

    let month = createdAt.getMonth() + 1;
    if (month < 10) month = `0${month}`;

    post.created_at = `${month}/${createdAt.getDate()}/${createdAt.getFullYear()}`;

    const car = await getShopcart(req);

    res.render("view_blog.ejs", {
      post: post,
      user: req.user,
      car
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
