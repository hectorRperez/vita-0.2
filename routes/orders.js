const router = require("express").Router();
const prisma = require("../config/database");
// ruta que se encarga de crear un producto
router.get(
  "/get_order",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();

    res.redirect("/login");
  },
  async (req, res) => {
    try {
      const { user } = req;

      // obtengo los parametros

      const order = await prisma.user.findOne({
        id,
        userId: user.id,
      });

      res.render("orders", { order: order });
    } catch (error) {
      res.send(error);
    }
  }
);

// ruta que se encarga de crear un producto
router.post("/add_cart", async (req, res) => {
  try {
    const { body, user } = req;

    // validations todo

    await beginTransaction();

    // busco el producto
    let sql = `SELECT * FROM products WHERE products.id = ?`;
    let product = await querySync(sql, [body.product_id])
      .then((r) => r[0])
      .catch((e) => {
        throw e;
      });

    // busco si existe una orden
    sql = `SELECT * FROM orders WHERE orders.user_id = ? AND orders.state_id = ?`;
    let order = await querySync(sql, [user.id, 1])
      .then((r) => r)
      .catch((e) => {
        throw e;
      });

    // en caso que no exista genere un nuevo pedido
    if (order.length === 0) {
      sql = `INSERT INTO orders (total_products,user_id, state_id) values (?,?,?)`;
      order = await querySync(sql, [1, user.id, 1])
        .then((r) => r)
        .catch((e) => {
          throw e;
        });
    }

    // si se acaba de crear un nuevo pedido creo el primer item
    if (order.insertId != undefined || order.insertId != null) {
      // calculo el precio total e inserto el producto a la orden
      let total = product.price * body.quantity;
      sql = `INSERT INTO orders_items (product_id, quantity, total, order_id) values (?,?,?,?)`;
      item = await querySync(sql, [
        product.id,
        body.quantity,
        total,
        order.insertId,
      ])
        .then((r) => r)
        .catch((e) => {
          throw e;
        });

      if (item.affectedRows == 0)
        throw "Error al agregar el articulo al carrito";

      // actualizo el total del pedido con el total del item nuevo
      sql = `UPDATE orders SET total=? WHERE id = ?`;
      order = await querySync(sql, [total, order.insertId])
        .then((r) => r)
        .catch((e) => {
          throw e;
        });

      if (order.affectedRows == 0) throw "Error al ajustar el pedido";

      // en caso que ya la orden exista
    } else {
      order = order[0];

      // busco si existe el producto en la orden
      sql = `SELECT * FROM orders_items WHERE order_id = ? AND product_id = ?`;
      item = await querySync(sql, [order.id, product.id])
        .then((r) => r[0])
        .catch((e) => {
          throw e;
        });

      // si el producto no existe
      if (item == undefined || item == null) {
        // calculo el precio total y lo inserto a la orden
        let total = product.price * body.quantity;
        sql = `INSERT INTO orders_items (product_id, quantity, total, order_id) values (?,?,?,?)`;
        item = await querySync(sql, [
          product.id,
          body.quantity,
          total,
          order.id,
        ])
          .then((r) => r)
          .catch((e) => {
            throw e;
          });

        if (item.affectedRows == 0)
          throw "Error al agregar el articulo al carrito";

        // agrego el nuevo producto y calculo el total del pedido
        order.total_products++;
        order.total = parseFloat(order.total) + parseFloat(total);

        // ajusto los datos del pedido
        sql = `UPDATE orders SET total_products=?, total=? WHERE id = ?`;
        order = await querySync(sql, [
          order.total_products,
          order.total,
          order.id,
        ])
          .then((r) => r)
          .catch((e) => {
            throw e;
          });

        if (order.affectedRows == 0) throw "Error al ajustar el pedido";

        // en caso que el producto si exista
      } else {
        // reto el total de item en el pedido
        order.total = order.total - item.total;

        // sumo la cantidad solicitada y calculo el precio total
        item.quantity = parseInt(item.quantity) + parseInt(body.quantity);
        item.total = item.quantity * parseFloat(product.price);

        order.total = order.total + item.total;

        // actualizo el item
        sql = `UPDATE orders_items SET quantity=?, total=? WHERE id = ?`;
        item = await querySync(sql, [item.quantity, item.total, item.id])
          .then((r) => r)
          .catch((e) => {
            throw e;
          });

        if (item.affectedRows == 0)
          throw "Error al agregar el articulo al carrito";

        // actualizo el pedido
        sql = `UPDATE orders SET total=? WHERE id = ?`;
        order = await querySync(sql, [order.total, order.id])
          .then((r) => r)
          .catch((e) => {
            throw e;
          });

        if (order.affectedRows == 0) throw "Error al ajustar el pedido";
      }
    }

    await commit();

    res.redirect(`/shop${product.id}`);
  } catch (e) {
    await rollback();
    console.error(e);
  }
});

module.exports = router;
