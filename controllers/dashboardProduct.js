const path = require("path");
const fs = require("fs");

const prisma = require("../config/database");
const getShopcart = require("../utils/shopcart");
const productLabel = require("../enums/productLabel");

class DashboardProductController {
  list = async (req, res) => {
    try {
      const categories = await prisma.category.findMany();
      const products = await prisma.product.findMany({
        orderBy: {
          created_at: 'asc'
        }
      });
      const car = await getShopcart(req);

      res.render("dashboard/products", {
        categories,
        products: products,
        user: req.user,
        car,
        product_label: productLabel,
      });
    } catch (error) {
      console.error(error);
    }
  };

  create = async (req, res) => {
    const body = req.body;
    const files = req.files;

    try {
      const sizes = body.sizes;
      const product = await prisma.product.create({
        data: {
          name: body.name,
          price: parseFloat(body.price),
          description: body.description,
          quantity: parseInt(body.quantity),
          sizes,
          assessment: parseInt(body.assessment),
          keyBenefits: body.keyBenefits,
          howUse: body.howUse,
          ingredients: body.ingredients,
          caution: body.caution,
          weight: body.weight,
          dimensions: body.dimensions,
          categoryId: body.categoryId,
          label: body.label,
        },
      });

      // defino las imagenes del producto
      if (files) {
        for (let i = 0; i < files.length; i++) {
          let image = `/img/products/${files[i].filename}`;
          await prisma.productImages.create({
            data: {
              productId: product.id,
              image: image,
              isFirst: i === 0,
            },
          });
        }
      }

      res.status(201).send({
        data: product,
        message: "Product created successfully",
        code: 201,
      });
    } catch (error) {
      res.status(400).send({
        data: error,
        status: 400,
        message: error.message,
      });
    }
  };

  getOne = async (req, res) => {
    try {
      const id = req.params.id;

      const product = await prisma.product.findUnique({
        where: {
          id,
        },
        include: {
          category: true,
          images: true,
        },
      });

      res.status(200).send({
        data: product,
        message: "Product it was obtained successfully",
        code: 200,
      });
    } catch (error) {
      console.error(error);
    }
  };

  update = async (req, res) => {
    const body = req.body;
    const files = req.files;
    const id = body.id;

    try {
      const sizes = body.sizes;

      const product = await prisma.product.update({
        where: {
          id,
        },
        data: {
          name: body.name,
          price: parseFloat(body.price),
          description: body.description,
          quantity: parseInt(body.quantity),
          sizes,
          assessment: parseInt(body.assessment),
          keyBenefits: body.keyBenefits,
          howUse: body.howUse,
          ingredients: body.ingredients,
          caution: body.caution,
          weight: body.weight,
          dimensions: body.dimensions,
          categoryId: body.categoryId,
          label: body.label,
        },
      });

      // defino las imagenes del producto
      if (files) {
        for (let i = 0; i < files.length; i++) {
          let image = `/img/products/${files[i].filename}`;
          await prisma.productImages.create({
            data: {
              productId: product.id,
              image: image,
              isFirst: false,
            },
          });
        }
      }

      res.status(200).send({
        data: product,
        message: "Product updated successfully",
        code: 200,
      });
    } catch (error) {
      res.status(400).send({
        data: error,
        status: 400,
        message: error.message,
      });
    }
  };

  delete = async (req, res) => {
    try {
      const id = req.params.id;

      const product = await prisma.product.findUnique({
        where: {
          id,
        },
        include: {
          images: true,
          carItems: true,
        },
      });

      if (product.carItems.length) {
        return res.status(400).send({
          data: null,
          status: 400,
          message:
            "This product exists in a shopping cart, it cannot be removed",
        });
      }

      const deleteProductImages = prisma.productImages.deleteMany({
        where: {
          productId: product.id,
        },
      });

      const deleteProduct = prisma.product.delete({
        where: {
          id,
        },
      });

      await prisma.$transaction([deleteProductImages, deleteProduct]);

      // Delete file
      product.images.map((productImage) => {
        if (fs.existsSync(path.join("public/", productImage.image))) {
          fs.unlinkSync(path.join("public/", productImage.image));
        }
      });

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
  };

  deleteImage = async (req, res) => {
    try {
      const id = req.params.id;
      const idImage = req.params.idImage;

      const product = await prisma.product.findUnique({
        where: {
          id,
        }
      });

      const productImage = await prisma.productImages.findUnique({
        where: {
          id: idImage,
        }
      });

      await prisma.productImages.deleteMany({
        where: {
          id: idImage,
          productId: product.id,
        },
      });

      // Delete file
      if (fs.existsSync(path.join("public/", productImage.image))) {
        fs.unlinkSync(path.join("public/", productImage.image));
      }

      res.status(200).send({
        message: "Image deleted successfully",
        code: 200,
      });
    } catch (error) {
      res.status(400).send({
        data: error,
        status: 400,
        message: error.message,
      });
    }
  };

  updateImage = async (req, res) => {
    try {
      const id = req.params.id;
      const idImage = req.params.idImage;

      await prisma.product.findUnique({
        where: {
          id,
        }
      });

      const productImage = await prisma.productImages.findUnique({
        where: {
          id: idImage,
        }
      });

      // File
      const file = req.file;

      if (file) {
        const newImage = `/img/products/${file.filename}`;

        if (fs.existsSync(path.join("public/", newImage))) {
          fs.renameSync(path.join("public/", newImage), path.join("public/", productImage.image));
        }
      }

      res.status(200).send({
        message: "Image updated successfully",
        code: 200,
      });
    } catch (error) {
      res.status(400).send({
        data: error,
        status: 400,
        message: error.message,
      });
    }
  };
}

module.exports = new DashboardProductController();
