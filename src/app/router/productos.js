const express = require("express");
const router = express.Router();
const translate = require("node-google-translate-skidz");
const fs = require("fs").promises;
const path = require('path');

async function traducir(txt) {
  const result = await translate({
    text: txt,
    source: "en",
    target: "es",
  });
  return result.translation;
}

router.get("/", async (req, res) => {
  const response = await fetch("https://fakestoreapi.com/products/");
  const productos = await response.json();

  for (producto of productos) {
    producto.title = await traducir(producto.title);
    producto.description = await traducir(producto.description);
    producto.category = await traducir(producto.category);
  }

  let descuentos = await fs.readFile("descuentos.json");
  descuentos = JSON.parse(descuentos);

  let desc;
  for (producto of productos) {
    desc = descuentos.filter((descuento) => descuento.id === producto.id);
  
    if (desc.length > 0) {
      producto.descuento = desc[0].descuento;
      producto.precioFinal = producto.price - (producto.price * producto.descuento / 100);
      producto.tieneDescuento = true; // Add this line
    } else {
      producto.descuento = 0;
      producto.precioFinal = producto.price;
      producto.tieneDescuento = false; // Add this line
    }
  }

  res.render("index", { productos: productos });
});

module.exports = router;