const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { product } = require("../config/database.js");
const prisma = require("../config/database.js");
const { UserType } = require("@prisma/client");
const isAdmin = require("../middleware/isAdmin.js");

// ruta que se carga de traer los productos
router.get("/get_products:page?", async (req, res) => {
  try {
    const { page } = req.params;

    const products = await prisma.product.findMany({
      include: { images: true },
      take: 10,
      offset: page * 10,
    });

    res.render("products", {
      products: products,
      pagination_items: num_items,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
  }
});

// ruta que se encarga de crear un producto
router.post("/create_product", isAdmin, async (req, res) => {
  try {
    const { files, body } = req;

    if (body.name == "") throw "El nombre del producto es obligatorio";

    if (body.price == "") throw "El precio del producto es obligatorio";

    if (body.description == "") throw "El precio del producto es obligatorio";

    if (isNaN(body.price)) throw "El precio del producto no es correcto";

    if (isNaN(body.quantity) || body.quantity == "")
      throw "Ingrese una cantidad correcta";

    if (isNaN(body.category_id)) throw "Ingrese una categoria correcta";

    if (body.category_id == "") throw "La categoria es obligatoria";

    //------------------------------------------
    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: body.price,
        description: body.description,
        quantity: body.quantity,
        category_id: body.category_id,
      },
    });

    // defino las imagenes del producto
    for (let i = 0; i < files.length; i++) {
      let image = `img/${files[i].filename}`;
      prisma.productImages.create({
        data: {
          product_id: product.id,
          image: image,
        },
      });
    }

    res.redirect("get_products");
  } catch (e) {
    await rollback();

    console.error(e);
  }
});

// ruta que se encarga de actualizar un producto
router.post("/update_product", isAdmin, async (req, res) => {
  try {
    const { body } = req;

    // valido que se envien los datos correctos
    // validaciones de formulario ---------

    if (body.name == "") throw "El nombre del producto es obligatorio";

    if (body.price == "") throw "El precio del producto es obligatorio";

    if (isNaN(body.price)) throw "El precio del producto no es correcto";

    if (body.description == "") throw "El precio del producto es obligatorio";

    if (isNaN(body.quantity) || body.quantity == "")
      throw "Ingrese una cantidad correcta";

    if (isNaN(body.category_id)) throw "Ingrese una categoria correcta";

    if (body.category_id == "") throw "La categoria es obligatoria";

    //------------------------------------------

    // defino la consulta sql
    const sql =
      "UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, category_id = ? WHERE id = ?";
    await querySync(sql, [
      body.name,
      body.description,
      body.price,
      body.quantity,
      body.category_id,
      body.id,
    ]).catch((e) => {
      throw e;
    });

    res.redirect("get_products");
  } catch (e) {
    console.error(e);
  }
});

// ruta que se carga de eliminar un producto
router.post("/delete_product", isAdmin, async (req, res) => {
  try {
    const { body } = req;

    await beginTransaction();

    // busco el producto
    const product = await querySync(
      "SELECT id, name FROM products WHERE id = ?",
      [body.product_id]
    )
      .then((r) => r[0])
      .catch((e) => {
        throw e;
      });

    // verifico si hay un producto
    if (product.id == undefined || product.id == null) {
      throw "El producto no existe";
    }

    // obtengo todas las imagenes
    const product_images = await querySync(
      "SELECT * FROM products_images WHERE product_id = ?",
      [body.product_id]
    ).catch((e) => {
      throw e;
    });

    // elimino las imagenes
    const result = await querySync(
      "DELETE FROM products_images WHERE product_id = ?",
      [body.product_id]
    ).catch((e) => {
      throw e;
    });

    // elimino el producto
    const result2 = await querySync("DELETE FROM products WHERE id = ?", [
      body.product_id,
    ]).catch((e) => {
      throw e;
    });

    if (result.affectedRows < 1) throw "Error al eliminar las imagenes";
    if (result2.affectedRows < 1) throw "Error al eliminar el producto";

    // recorro la lista de imagenes y las voy borrando una a una
    for (let i = 0; i < product_images.length; i++) {
      fs.unlinkSync(path.join("public/", product_images[i].image));
    }

    await commit();

    res.redirect("get_products");
  } catch (e) {
    await rollback();
    console.error(e);
  }
});

module.exports = router;
