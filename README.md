# E-Commerce - Práctico Integrador Web II

Este proyecto es un E-Commerce desarrollado en Node.js y Express, utilizando Pug.

# Descripción del Proyecto

La aplicación consume un listado de productos provisto por la API FakeStoreAPI. Los productos se muestran en una grilla de 4 columnas, cada uno en una card que incluye la imagen del producto, título, descripción (máximo 30 caracteres), categoría y precio.

## Funcionalidades

* **Visualización de Productos**: Muestra productos en una grilla de 4 columnas. La descripción completa se muestra al pasar el mouse por encima.
* **Productos en Oferta**: Los productos en oferta se resaltan con una banda "de oferta" y muestran el precio original, el porcentaje de descuento y el precio final. La información de las ofertas se obtiene del archivo `descuentos.json`.
* **Traducción al Español**: Títulos y descripciones de productos se muestran en español utilizando el paquete `node-google-translate-skidz`.
* **Carrito de Compras**: Los usuarios pueden agregar productos al carrito de compra. La página de gestión del carrito permite eliminar y modificar cantidades, y finalizar la compra.
* **Compras Realizadas**: Los usuarios pueden consultar las compras realizadas. En cada compra se muestran los productos con su título, descripción, precio unitario, cantidad, subtotal y total de compra.


## Instalación

1. **Clonar el Repositorio**

    ```bash
    git clone git@github.com:JNZader/integrador10.git
    ```

2. **Instalar Paquetes**

    ```bash
    npm install
    ```

3. **Inicializar el Proyecto**

    ```bash
    npm start
    ```
