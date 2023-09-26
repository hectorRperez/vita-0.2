const path = require("path");
const fs = require("fs");

const prisma = require("../config/database");
const getShopcart = require("../utils/shopcart");

class DashboardBannerController {
  list = async (req, res) => {
    try {
      const banners = await prisma.banner.findMany();
      const car = await getShopcart(req);

      res.render("dashboard/banners", {
        banners,
        user: req.user,
        car,
      });
    } catch (error) {
      console.error(error);
    }
  }

  updateImage = async (req, res) => {
    try {
      const body = req.body;
      // File
      const file = req.file;

      if (file) {
        const newImage = `/img/banners/${file.filename}`;

        let fileName = 'home.jpg';

        if (body.id !== 'imageHome') {
          fileName = 'skincare.jpg';
        }

        if (fs.existsSync(path.join("public/", newImage))) {
          fs.renameSync(path.join("public/", newImage), path.join("public/", `/img/banners/${fileName}`));
        }
      }

      return res.json({
        message: "Image updated successfully",
        status: 200,
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

module.exports = new DashboardBannerController();
