// Espera a que el contenido del DOM se cargue completamente
document.addEventListener("DOMContentLoaded", async () => {
  // Obtiene el carrito almacenado en el almacenamiento local y lo asigna a la variable carrito
  let carrito = await getCarrito();
  // Actualiza la cantidad de productos en el carrito en la interfaz de usuario
  actualizarCarritoCantidad();

  // Obtiene todos los botones de "Agregar al carrito" y les asigna un listener de eventos
  const btnsAgregar = document.querySelectorAll(".btn-agregar");
  btnsAgregar.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      // Obtiene la información del producto desde los atributos de datos del botón
      const producto = {
        id: e.target.id,
        title: e.target.getAttribute('data-title'),
        price: parseFloat(e.target.getAttribute('data-price')),
        description: e.target.getAttribute('data-description'),
        category: e.target.getAttribute('data-category'),
        image: e.target.getAttribute('data-image')
      };

      // Agrega el producto al carrito
      await agregarProductoAlCarrito(producto);
      // Actualiza la información del carrito después de agregar el producto
      carrito = await getCarrito();
      actualizarCarritoCantidad(); // Actualiza la cantidad de productos en el carrito en la interfaz de usuario
    });
  });
});

// Función asincrónica para obtener el carrito desde el almacenamiento local
async function getCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

// Función asincrónica para agregar un producto al carrito
async function agregarProductoAlCarrito(producto) {
  let carrito = await getCarrito();
  const productoExistente = carrito.find(p => p.id === producto.id);

  if (productoExistente) {
    productoExistente.cantidad++; // Incrementa la cantidad si el producto ya está en el carrito
  } else {
    producto.cantidad = 1;
    carrito.push(producto); // Agrega el producto al carrito con cantidad 1 si es nuevo
  }

  localStorage.setItem("carrito", JSON.stringify(carrito)); // Actualiza el carrito en el almacenamiento local
}

// Función para actualizar la cantidad total de productos en el carrito en la interfaz de usuario
function actualizarCarritoCantidad() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const cantidadTotal = carrito.reduce((total, producto) => total + producto.cantidad, 0);
  document.getElementById('carrito-cantidad').innerText = cantidadTotal;
}