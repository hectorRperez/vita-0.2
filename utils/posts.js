const prisma = require("../config/database");

const listPost = async (take, excludeIds) => {
    let where = {};

    if (excludeIds) {
      where = {
        NOT: {
          id: {
            in: excludeIds
          }
        }
      };
    }

    let posts = await prisma.post.findMany({
      where,
      include: {
        createdBy: true,
      },
      take,
    });

    posts = posts.map(post => {
      const createdAt = new Date(post.created_at)

      let month = createdAt.getMonth() + 1;
      if (month < 10) month = `0${month}`;

      post.created_at = `${month}/${createdAt.getDate()}/${createdAt.getFullYear()}`;

      return post;
    });
  
    return posts;
  };

module.exports = listPost;