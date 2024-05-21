const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

/**
 * Inicializa el archivo carrito.json si no existe.
 * Esta función verifica si el archivo carrito.json existe 
 * y lo inicializa como un array vacío si no existe.
 * 
 * @returns {Promise<void>}
 */
async function initCarrito() {
  try {
    await fs.readFile(path.join(__dirname, "carrito.json"), "utf-8");
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(path.join(__dirname, "carrito.json"), "[]");
    } else {
      throw error;
    }
  }
}

// Llamamos a la función de inicialización al cargar el módulo
initCarrito();

/**
 * Obtiene el carrito.
 * Lee el contenido de carrito.json y lo devuelve como un objeto JavaScript.
 * 
 * @returns {Promise<Object[]>} El carrito como un array de objetos.
 */
async function getCarrito() {
  try {
    const data = await fs.readFile(path.join(__dirname, "carrito.json"), "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return []; // Si el archivo no existe, devolvemos un array vacío
    } else {
      throw error;
    }
  }
}

/**
 * Guarda el carrito.
 * Escribe el carrito proporcionado en el archivo carrito.json.
 * 
 */
async function saveCarrito(carrito) {
  try {
    await fs.writeFile(path.join(__dirname, "carrito.json"), JSON.stringify(carrito, null, 2));
  } catch (error) {
    console.error("Error al guardar el carrito:", error);
    throw error;
  }
}

/**
 * Ruta para obtener el carrito.
 * Devuelve el contenido del carrito ya sea en formato JSON o renderizando una vista, dependiendo de la solicitud del cliente.
 * 
 */
router.get("/carrito", async (req, res) => {
  try {
    const carrito = await getCarrito();

    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      // Si el cliente espera una respuesta JSON
      res.json({ carrito: carrito });
    } else {
      // Si el cliente espera una página renderizada
      res.render("carrito", { carrito });
    }
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

/**
 * Ruta para procesar la compra.
 * Guarda el carrito enviado en compras.json con un ID único y devuelve la nueva compra.
 * 
 */
router.post("/comprar", async (req, res) => {
  const carrito = req.body;
  
  let compras = [];
  try {
    // Intentamos leer el archivo compras.json
    compras = JSON.parse(await fs.readFile("compras.json", "utf-8"));
  } catch (error) {
    if (error.code !== "ENOENT") {
      // Si el error no es porque el archivo no existe, devolvemos un error
      console.error("Error al leer el archivo compras.json:", error);
      return res.status(500).json({ error: "Error al obtener las compras" });
    }
  }

  // Generamos un nuevo ID para la compra
  const ids = compras.map((compra) => compra.id);
  const id = Math.max(...ids, 0) + 1;

  // Creamos el objeto de la nueva compra
  const nuevaCompra = {
    id: id,
    carrito: carrito, // Utilizamos el carrito enviado desde el cliente
  };

  // Añadimos la nueva compra a la lista de compras
  compras.push(nuevaCompra);

  try {
    // Guardamos la lista de compras actualizada en compras.json
    await fs.writeFile("compras.json", JSON.stringify(compras));
  } catch (error) {
    console.error("Error al escribir en el archivo compras.json:", error);
    return res.status(500).json({ error: "Error al guardar la compra" });
  }

  // Devolvemos la nueva compra al cliente
  res.json({ compra: nuevaCompra, message: "Compra realizada con éxito!" });
});

module.exports = router;