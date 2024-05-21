function getCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function actualizarCarritoCantidad() {
  let carrito = getCarrito();
  const cantidadTotal = carrito.reduce((total, producto) => total + producto.cantidad, 0);
  document.getElementById('carrito-cantidad').innerText = cantidadTotal;
}

// Espera a que el contenido del DOM se cargue completamente
document.addEventListener('DOMContentLoaded', function() {
  // Obtiene el contenedor de las compras desde el DOM

  actualizarCarritoCantidad();
  
  const comprasContainer = document.getElementById('compras-container');

  // Realiza una solicitud fetch para obtener los datos de las compras
  fetch('/compras')
    // Convierte la respuesta a formato JSON
    .then(response => response.json())
    .then(data => {
      // Itera sobre cada compra en los datos obtenidos
      data.forEach(compra => {
        // Crea un div para representar la compra
        const compraDiv = document.createElement('div');
        compraDiv.className = 'compra';
        
        // Crea un título para la compra e inserta su ID
        const compraTitle = document.createElement('h3');
        compraTitle.textContent = `Compra ${compra.id}`;
        compraDiv.appendChild(compraTitle);

        // Itera sobre cada producto en el carrito de la compra
        compra.carrito.forEach(producto => {
          // Crea un div para representar un producto en el carrito
          const itemCarrito = document.createElement('div');
          itemCarrito.className = 'item-carrito';

          // Crea una imagen para el producto y establece su src y alt
          const img = document.createElement('img');
          img.src = producto.image;
          img.alt = producto.title;
          itemCarrito.appendChild(img);

          // Crea un div para la información del producto
          const infoDiv = document.createElement('div');
          infoDiv.className = 'info';

          // Crea un título para el producto e inserta su título
          const title = document.createElement('h5');
          title.textContent = producto.title;
          infoDiv.appendChild(title);

          // Crea un párrafo para la descripción del producto e inserta su descripción
          const description = document.createElement('p');
          description.textContent = producto.description;
          infoDiv.appendChild(description);

          // Crea un párrafo para la categoría del producto e inserta su categoría
          const category = document.createElement('p');
          category.textContent = `Categoria: ${producto.category}`;
          infoDiv.appendChild(category);

          // Crea un párrafo para el precio del producto e inserta su precio
          const price = document.createElement('p');
          price.textContent = `Precio: $${producto.price.toFixed(2)}`;
          infoDiv.appendChild(price);

          // Crea un párrafo para la cantidad del producto e inserta su cantidad
          const cantidad = document.createElement('p');
          cantidad.textContent = `Cantidad: ${producto.cantidad}`;
          infoDiv.appendChild(cantidad);

          // Añade el div de información del producto al div del producto en el carrito
          itemCarrito.appendChild(infoDiv);
          // Añade el div del producto en el carrito al div de la compra
          compraDiv.appendChild(itemCarrito);
        });

        // Añade el div de la compra al contenedor de compras
        comprasContainer.appendChild(compraDiv);
      });
    })
    // Maneja los errores de la solicitud fetch
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});