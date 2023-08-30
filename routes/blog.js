const router = require("express").Router();

const prisma = require("../config/database");
const getShopcart = require("../utils/shopcart");
const listPost = require("../utils/posts");

// ruta inicial
router.get("/blog", async (req, res) => {
  try {
    // Posts
    const posts = await listPost();

    // Shopcart
    const car = await getShopcart(req);

    res.render("blog/index.ejs", {
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

    // Shopcart
    const car = await getShopcart(req);

    // Posts
    const posts = await listPost(undefined, [id]);

    res.render("blog/view_post.ejs", {
      post: post,
      user: req.user,
      car,
      posts
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
