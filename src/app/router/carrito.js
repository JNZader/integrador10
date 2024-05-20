const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Inicializar carrito.json si no existe
async function initCarrito() {
    try {
        await fs.readFile(path.join(__dirname, 'carrito.json'), 'utf-8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(path.join(__dirname, 'carrito.json'), '[]');
        } else {
            throw error;
        }
    }
}

initCarrito();

// Función para obtener el carrito
async function getCarrito() {
    try {
        const data = await fs.readFile(path.join(__dirname, 'carrito.json'), 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        } else {
            throw error;
        }
    }
}

// Función para guardar el carrito
async function saveCarrito(carrito) {
    try {
        await fs.writeFile(path.join(__dirname, 'carrito.json'), JSON.stringify(carrito, null, 2));
    } catch (error) {
        console.error('Error al guardar el carrito:', error);
        throw error;
    }
}

// Ruta para obtener el carrito
router.get('/carrito', async (req, res) => {
    try {
        const carrito = await getCarrito();
        res.render('carrito', { carrito });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// Ruta para procesar la compra
router.post('/comprar', async (req, res) => {
    const carrito = req.body;
    
    let compras = [];
    try {
        compras = JSON.parse(await fs.readFile('compras.json', 'utf-8'));
    } catch (error) {
        if (error.code!== 'ENOENT') {
            console.error('Error al leer el archivo compras.json:', error);
            return res.status(500).json({ error: 'Error al obtener las compras' });
        }
    }

    const ids = compras.map((compra) => compra.id);
    const id = Math.max(...ids, 0) + 1;

    const nuevaCompra = {
        id: id,
        carrito: carrito, // Utiliza el carrito enviado desde el cliente
    };

    compras.push(nuevaCompra);

    try {
        await fs.writeFile('compras.json', JSON.stringify(compras));
    } catch (error) {
        console.error('Error al escribir en el archivo compras.json:', error);
        return res.status(500).json({ error: 'Error al guardar la compra' });
    }

    res.json({ compra: nuevaCompra, message: 'Compra realizada con éxito!' });
});


module.exports = router;