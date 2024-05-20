document.addEventListener('DOMContentLoaded', function() {
    const comprasContainer = document.getElementById('compras-container');
  
    fetch('/compras')
      .then(response => response.json())
      .then(data => {
        data.forEach(compra => {
          const compraDiv = document.createElement('div');
          compraDiv.className = 'compra';
          
          const compraTitle = document.createElement('h3');
          compraTitle.textContent = `Compra ${compra.id}`;
          compraDiv.appendChild(compraTitle);
  
          compra.carrito.forEach(producto => {
            const itemCarrito = document.createElement('div');
            itemCarrito.className = 'item-carrito';
  
            const img = document.createElement('img');
            img.src = producto.image;
            img.alt = producto.title;
            itemCarrito.appendChild(img);
  
            const infoDiv = document.createElement('div');
            infoDiv.className = 'info';
  
            const title = document.createElement('h5');
            title.textContent = producto.title;
            infoDiv.appendChild(title);
  
            const description = document.createElement('p');
            description.textContent = producto.description;
            infoDiv.appendChild(description);
  
            const category = document.createElement('p');
            category.textContent = `Categoria: ${producto.category}`;
            infoDiv.appendChild(category);
  
            const price = document.createElement('p');
            price.textContent = `Precio: $${producto.price.toFixed(2)}`;
            infoDiv.appendChild(price);
  
            const cantidad = document.createElement('p');
            cantidad.textContent = `Cantidad: ${producto.cantidad}`;
            infoDiv.appendChild(cantidad);
  
            itemCarrito.appendChild(infoDiv);
            compraDiv.appendChild(itemCarrito);
          });
  
          comprasContainer.appendChild(compraDiv);
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  });
  