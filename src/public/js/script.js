document.addEventListener("DOMContentLoaded", async () => {
  let carrito = await getCarrito();
  updateCarritoCantidad();

  const btnsAgregar = document.querySelectorAll(".btn-agregar");
  btnsAgregar.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const producto = {
        id: e.target.id,
        title: e.target.getAttribute('data-title'),
        price: parseFloat(e.target.getAttribute('data-price')),
        description: e.target.getAttribute('data-description'),
        category: e.target.getAttribute('data-category'),
        image: e.target.getAttribute('data-image')
      };

      await agregarProductoAlCarrito(producto);
      carrito = await getCarrito();
      updateCarritoCantidad();
    });
  });
});

async function getCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

async function agregarProductoAlCarrito(producto) {
  let carrito = await getCarrito();
  const productoExistente = carrito.find(p => p.id === producto.id);

  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function updateCarritoCantidad() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const cantidadTotal = carrito.reduce((total, producto) => total + producto.cantidad, 0);
  document.getElementById('carrito-cantidad').innerText = cantidadTotal;
}
