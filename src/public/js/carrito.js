document.addEventListener("DOMContentLoaded", () => {
  const carrito = getCarrito();
  updateCarritoCantidad();
  renderCarrito(carrito);

  function getCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    return carrito;
  }

  function updateCarritoCantidad() {
    const carritoCantidadElement = document.getElementById("carrito-cantidad");
    if (carritoCantidadElement) {
      carritoCantidadElement.innerText = carrito.reduce(
        (total, item) => total + item.cantidad,
        0
      );
    }
    document.querySelector(
      ".volver"
    ).textContent = `Volver a la página principal (${carrito.reduce(
      (total, item) => total + item.cantidad,
      0
    )})`;
  }

  async function renderCarrito(carrito) {
    const container = document.querySelector(".carrito-container");
    if (!container) return;

    container.innerHTML = ""; // Clear the container before rendering

    if (carrito.length === 0) {
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

    container.innerHTML = "";

    carrito.forEach((item) => {
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
                <p class="card-text">Subtotal: $${(
                  item.cantidad * item.price
                ).toFixed(2)}</p>
                <div class="acciones">
                  <button class="btn btn-outline-primary btn-sumar" data-id="${
                    item.id
                  }">+</button>
                  <button class="btn btn-outline-secondary btn-restar" data-id="${
                    item.id
                  }">-</button>
                  <button class="btn btn-outline-danger btn-eliminar" data-id="${
                    item.id
                  }">Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      container.appendChild(itemDiv);
    });
    const volverLink = document.createElement("a");
    volverLink.className = "volver";
    volverLink.textContent = "Volver a la página principal";
    volverLink.href = "/";
    container.appendChild(volverLink);

    const btnConfirmar2 = document.createElement("button");
    btnConfirmar2.className = "btn-confirmar";
    btnConfirmar2.textContent = "Confirmar Compra";
    container.appendChild(btnConfirmar2);
    document.querySelectorAll(".btn-sumar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = e.target.getAttribute("data-id");
        agregarProductoAlCarrito(productId);
        updateCarrititoCantidad();
        renderCarrito(getCarrito());
      });
    });

    document.querySelectorAll(".btn-restar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = e.target.getAttribute("data-id");
        restarProductoDelCarrito(productId);
        updateCarrititoCantidad();
        renderCarrito(getCarrito());
      });
    });

    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = e.target.getAttribute("data-id");
        eliminarProductoDelCarrito(productId);
        updateCarrititoCantidad();
        renderCarrito(getCarrito());
      });
    });

    const btnConfirmar = document.querySelector(".btn-confirmar");
    if (btnConfirmar) {
      btnConfirmar.addEventListener("click", async () => {
        try {
          // Guardar el carrito en un archivo carrito.json
          await fetch('/comprar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(carrito)
          })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch(error => console.error('Error:', error));

          alert(
            "Compra finalizada con éxito. Pronto la recibirá en su domicilio."
          );
          localStorage.removeItem("carrito"); // Clear cart after purchase
          location.reload();
        } catch (error) {
          console.error("Error al confirmar la compra:", error);
        }
      });
    }
  }

  function agregarProductoAlCarrito(id) {
    let carrito = getCarrito();
    const productIndex = carrito.findIndex((cartItem) => cartItem.id === id);

    if (productIndex !== -1) {
      carrito[productIndex].cantidad++;
    } else {
      // Aquí debes obtener el resto de propiedades del producto según tu lógica
      const nuevoProducto = {
        id,
        // Resto de propiedades del producto que deberías obtener desde algún lugar
        cantidad: 1,
      };
      carrito.push(nuevoProducto);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    updateCarritoCantidad(); // Call after updating cart
  }

  function restarProductoDelCarrito(id) {
    let carrito = getCarrito();
    const productIndex = carrito.findIndex((cartItem) => cartItem.id === id);

    if (productIndex !== -1) {
      if (carrito[productIndex].cantidad > 1) {
        carrito[productIndex].cantidad--;
      } else {
        carrito.splice(productIndex, 1);
      }
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    updateCarritoCantidad(); // Call after updating cart
  }

  function eliminarProductoDelCarrito(id) {
    let carrito = getCarrito();
    const productIndex = carrito.findIndex((cartItem) => cartItem.id === id);

    if (productIndex !== -1) {
      carrito.splice(productIndex, 1);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    updateCarritoCantidad(); // Call after updating cart
  }

  function updateCarrititoCantidad() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const cantidadTotal = carrito.reduce(
      (total, producto) => total + producto.cantidad,
      0
    );
    document.getElementById("carrito-cantidad").innerText = cantidadTotal;
  }
});
