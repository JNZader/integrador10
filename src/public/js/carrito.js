// Ejecuta el código una vez que el contenido del DOM se haya cargado completamente
document.addEventListener("DOMContentLoaded", () => {
  let carrito = getCarrito(); // Obtiene el carrito del almacenamiento local
  actualizarCarritoCantidad(); // Actualiza la cantidad total de productos en el carrito
  renderCarrito(carrito); // Renderiza el carrito de compras

  // Obtiene el carrito desde el almacenamiento local
  function getCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
  }

  // Actualiza la cantidad total de productos en el carrito
  function actualizarCarritoCantidad() {
    let carrito = getCarrito();
    const carritoCantidadElement = document.getElementById("carrito-cantidad");
    const cantidadTotal = carrito.reduce((total, producto) => total + producto.cantidad, 0);

    if (carritoCantidadElement) {
      carritoCantidadElement.innerText = cantidadTotal; // Actualiza el elemento del DOM con la cantidad total
    }

    const volverLink = document.querySelector(".volver");
    if (volverLink) {
      volverLink.textContent = `Volver a la página principal (${cantidadTotal})`; // Actualiza el texto del enlace "volver"
    }
  }

  // Renderiza el contenido del carrito en la página
  async function renderCarrito(carrito) {
    const container = document.querySelector(".carrito-container");
    if (!container) return;

    container.innerHTML = ""; // Limpia el contenedor antes de renderizar

    if (carrito.length === 0) {
      // Muestra un mensaje si no hay productos en el carrito
      const noProductsMessage = document.createElement("p");
      noProductsMessage.className = "text-center";
      noProductsMessage.textContent = "No hay productos en el carrito.";
      container.appendChild(noProductsMessage);

      const volverLink = document.createElement("a");
      volverLink.className = "volver";
      volverLink.textContent = "Volver a la página principal";
      volverLink.href = "/";
      container.appendChild(volverLink);

      return;
    }

    let totalCompra = 0;

    carrito.forEach((item) => {
      totalCompra += item.cantidad * item.price; // Calcula el total de la compra

      // Crea un contenedor para cada ítem del carrito
      const itemDiv = document.createElement("div");
      itemDiv.className = "col-md-12";
      itemDiv.innerHTML = `
        <div class="card mb-3">
          <div class="row no-gutters">
            <div class="col-md-4">
              <img src="${item.image}" class="card-img" alt="${item.title}">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.description}</p>
                <p class="card-text">Cantidad: ${item.cantidad}</p>
                <p class="card-text">Precio: $${item.price.toFixed(2)}</p>
                <p class="card-text">Subtotal: $${(item.cantidad * item.price).toFixed(2)}</p>
                <div class="acciones">
                  <button class="btn btn-outline-primary btn-sumar" data-id="${item.id}">+</button>
                  <button class="btn btn-outline-secondary btn-restar" data-id="${item.id}">-</button>
                  <button class="btn btn-outline-danger btn-eliminar" data-id="${item.id}">Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      container.appendChild(itemDiv); // Añade el ítem al contenedor
    });

    // Muestra el total de la compra
    const totalDiv = document.createElement("div");
    totalDiv.className = "total-compra";
    totalDiv.innerHTML = `<h4>Total de la compra: $${totalCompra.toFixed(2)}</h4>`;
    container.appendChild(totalDiv);

    // Crea y añade el enlace "volver"
    const volverLink = document.createElement("a");
    volverLink.className = "volver";
    volverLink.textContent = "Volver a la página principal";
    volverLink.href = "/";
    container.appendChild(volverLink);

    // Crea y añade el botón "Confirmar Compra"
    const btnConfirmar = document.createElement("button");
    btnConfirmar.className = "btn-confirmar";
    btnConfirmar.textContent = "Confirmar Compra";
    container.appendChild(btnConfirmar);

    // Añade los event listeners a los botones de sumar, restar y eliminar
    document.querySelectorAll(".btn-sumar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = e.target.getAttribute("data-id");
        agregarProductoAlCarrito(productId);
        actualizarCarritoCantidad();
        renderCarrito(getCarrito());
      });
    });

    document.querySelectorAll(".btn-restar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = e.target.getAttribute("data-id");
        restarProductoDelCarrito(productId);
        actualizarCarritoCantidad();
        renderCarrito(getCarrito());
      });
    });

    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = e.target.getAttribute("data-id");
        eliminarProductoDelCarrito(productId);
        actualizarCarritoCantidad();
        renderCarrito(getCarrito());
      });
    });

    // Añade el event listener al botón de confirmar compra
    btnConfirmar.addEventListener("click", async () => {
      try {
        await fetch("/comprar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(carrito),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error("Error:", error));

        alert("Compra finalizada con éxito. Pronto la recibirá en su domicilio.");
        localStorage.removeItem("carrito"); // Limpia el carrito después de la compra
        location.reload(); // Recarga la página
      } catch (error) {
        console.error("Error al confirmar la compra:", error);
      }
    });
  }

  // Añade un producto al carrito
  function agregarProductoAlCarrito(id) {
    let carrito = getCarrito();
    const productIndex = carrito.findIndex((cartItem) => cartItem.id === id);

    if (productIndex !== -1) {
      carrito[productIndex].cantidad++; // Incrementa la cantidad si el producto ya está en el carrito
    } else {
      const nuevoProducto = {
        id,
        cantidad: 1,
        // Asume que obtienes el resto de propiedades del producto de algún otro lugar
      };
      carrito.push(nuevoProducto); // Añade el nuevo producto al carrito
    }

    localStorage.setItem("carrito", JSON.stringify(carrito)); // Actualiza el carrito en el almacenamiento local
    actualizarCarritoCantidad(); // Actualiza la cantidad total en el carrito
  }

  // Resta un producto del carrito
  function restarProductoDelCarrito(id) {
    let carrito = getCarrito();
    const productIndex = carrito.findIndex((cartItem) => cartItem.id === id);

    if (productIndex !== -1) {
      if (carrito[productIndex].cantidad > 1) {
        carrito[productIndex].cantidad--; // Decrementa la cantidad si es mayor a 1
      } else {
        carrito.splice(productIndex, 1); // Elimina el producto si la cantidad es 1
      }
    }

    localStorage.setItem("carrito", JSON.stringify(carrito)); // Actualiza el carrito en el almacenamiento local
    actualizarCarritoCantidad(); // Actualiza la cantidad total en el carrito
  }

  // Elimina un producto del carrito
  function eliminarProductoDelCarrito(id) {
    let carrito = getCarrito();
    const productIndex = carrito.findIndex((cartItem) => cartItem.id === id);

    if (productIndex !== -1) {
      carrito.splice(productIndex, 1); // Elimina el producto del carrito
    }

    localStorage.setItem("carrito", JSON.stringify(carrito)); // Actualiza el carrito en el almacenamiento local
    actualizarCarritoCantidad(); // Actualiza la cantidad total en el carrito
  }
});