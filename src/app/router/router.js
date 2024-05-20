const express = require("express");
const router = express.Router();
const productosRouter = require("./productos");
const carritoRouter = require("./carrito");
const comprasRouter = require("./compras");

router.get("/", productosRouter);
router.get("/carrito", carritoRouter);
router.post("/carrito", carritoRouter);
router.post("/comprar", carritoRouter);
router.get("/compras", comprasRouter);

module.exports = router;
