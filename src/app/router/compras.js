const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

/**
 * GET /compras
 * 
 * Ruta para obtener los datos de las compras.
 * 
 * Lee el archivo `compras.json` y devuelve su contenido.
 * Si el cliente espera una respuesta JSON (basado en el encabezado `Accept`), devuelve los datos en formato JSON.
 * De lo contrario, renderiza una plantilla llamada "compras" con los datos obtenidos.
 * 
 */

router.get("/compras", async (req, res) => {
  try {
    // Construye la ruta al archivo compras.json
    const comprasPath = path.join(__dirname, "../../../compras.json");

    // Lee el contenido del archivo compras.json
    const data = await fs.readFile(comprasPath, "utf8");

    // Parsear los datos JSON
    const compras = JSON.parse(data);

    // Verifica si el cliente espera una respuesta JSON
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      // Envía los datos en formato JSON
      res.json(compras);
    } else {
      // Renderiza la plantilla "compras" con los datos
      res.render("compras", { compras });
    }
  } catch (err) {
    // Log de cualquier error que ocurra durante la lectura del archivo
    console.error("Error leyendo compras.json:", err);

    // Envía una respuesta de error 500 (Error Interno del Servidor)
    res.status(500).send("Error leyendo compras");
  }
});

module.exports = router;