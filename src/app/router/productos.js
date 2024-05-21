const express = require("express");
const router = express.Router();
const translate = require("node-google-translate-skidz");
const fs = require("fs").promises;
const path = require('path');

/**
 * Función para traducir texto del inglés al español.
 * 
 * @param {string} txt - El texto a traducir.
 * @returns {Promise<string>} - Promesa que se resuelve con el texto traducido.
 */
async function traducir(txt) {
  const result = await translate({
    text: txt,
    source: "en",
    target: "es",
  });
  return result.translation;
}

/**
 * GET /
 * 
 * Ruta principal para obtener y traducir productos de una API externa, y aplicar descuentos.
 * 
 * Realiza una solicitud a la API de productos, traduce el título, descripción y categoría de cada producto,
 * y aplica descuentos basados en un archivo local `descuentos.json`.
 * 
 * Si el cliente espera una respuesta JSON (basado en el encabezado `Accept`), devuelve los productos en formato JSON.
 * De lo contrario, renderiza una plantilla llamada "index" con los productos obtenidos.
 * 
 */
router.get("/", async (req, res) => {
  try {
    // Solicita productos de la API externa
    const response = await fetch("https://fakestoreapi.com/products/");
    const productos = await response.json();

    // Traduce los campos necesarios de cada producto
    for (const producto of productos) {
      producto.title = await traducir(producto.title);
      producto.description = await traducir(producto.description);
      producto.category = await traducir(producto.category);
    }

    // Lee el archivo de descuentos
    let descuentos = await fs.readFile("descuentos.json", "utf-8");
    descuentos = JSON.parse(descuentos);

    // Aplica descuentos a los productos
    for (const producto of productos) {
      const desc = descuentos.find((descuento) => descuento.id === producto.id);
      
      if (desc) {
        producto.descuento = desc.descuento;
        producto.precioFinal = producto.price - (producto.price * producto.descuento / 100);
        producto.tieneDescuento = true;
      } else {
        producto.descuento = 0;
        producto.precioFinal = producto.price;
        producto.tieneDescuento = false;
      }
    }

    // Verifica si el cliente espera una respuesta JSON
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      res.json({ productos: productos });
    } else {
      res.render("index", { productos: productos });
    }
  } catch (err) {
    console.error("Error al procesar la solicitud:", err);
    res.status(500).send("Error al obtener los productos");
  }
});

module.exports = router;
