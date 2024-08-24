const contenedorProductos = document.querySelector("#contenedor_productos");
const botonesCategorias = document.querySelectorAll(".boton_categoria");
const tituloPrincipal = document.querySelector("#titulo_principal");
let botonesAgregar = document.querySelectorAll(".producto_agregar");
const numeroComprasElement = document.querySelector(".numero_compras");

let productosComprados = [];
let productos = [];

//** PRODUCTOS */

async function inicializarArrays() {
  const response = await fetch(`/productos/`);
  const productos = await response.json();

  // Inicializa productosComprados con la misma longitud que productos
  productosComprados = new Array(productos.length).fill(0);
}

async function obtenerProductos() {
  try {
    const response = await fetch(`/productos/`);
    if (!response.ok) {
      throw new Error("Error al cargar los productos por categoría");
    }
    const productos = await response.json();
    return productos;
  } catch (error) {
    console.error("Error al cargar los productos por categoría:", error);
    return [];
  }
}

async function obtenerProductosPorCategoria(categoria) {
  try {
    const response = await fetch(`/productos/${categoria}`);
    if (!response.ok) {
      throw new Error("Error al cargar los productos por categoría");
    }
    const productos = await response.json();
    return productos;
  } catch (error) {
    console.error("Error al cargar los productos por categoría:", error);
    return [];
  }
}

async function cargarProductosTodos() {
  const productos = await obtenerProductos();
  productos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
      <img class="producto_imagen" src="${producto.imagen}" alt="${producto.titulo}">
      <div class="producto_info">
        <h3>${producto.titulo}</h3>
        <p>$${producto.precio}</p>
        <button id="${producto.id}" class="producto_agregar" onclick="agregarAlCarrito(${producto.id})")>
          <span class="texto_producto_agregar">Comprar</span>
          <span class="texto_hover">Proximamente...</span>
        </button>
      </div>
    `;
    contenedorProductos.append(div);
    console.log(productos);
    console.log(productosComprados);
  });
}

async function cargarProductosPorCategoria(categoria) {
  const productos = await obtenerProductosPorCategoria(categoria);
  productos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
      <img class="producto_imagen" src="${producto.imagen}" alt="${producto.titulo}">
      <div class="producto_info">
        <h3>${producto.titulo}</h3>
        <p>$${producto.precio}</p>
        <button id="${producto.id}" class="producto_agregar" onclick="agregarAlCarrito(${producto.id})")>Comprar</button>
      </div>
    `;
    contenedorProductos.append(div);
  });
}

botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach((boton) => boton.classList.remove("active"));
    e.currentTarget.classList.add("active");
    contenedorProductos.innerHTML = ``;
    if (e.currentTarget.id !== "todos") {
      cargarProductosPorCategoria(e.currentTarget.id);
      tituloPrincipal.innerText = e.currentTarget.id;
    } else {
      cargarProductosTodos();
      tituloPrincipal.innerText = "Todos los productos";
    }
  });
});

async function agregarAlCarrito(idProducto) {
  productosComprados[idProducto] += 1;
  actualizarNumeroCompras();
  console.log("Array de productosComprados: ", productosComprados);
}

function actualizarNumeroCompras() {
  const totalCompras = productosComprados.reduce((acc, curr) => acc + curr, 0);
  const numeroComprasElement = document.querySelector(".numero_compras");
  numeroComprasElement.textContent = totalCompras;
}

//* MODAL */

const imagenesProducto = document.querySelectorAll(".producto_imagen");
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeBtn = document.querySelector(".modal_close");

function openModal(src) {
  modal.style.display = "flex";
  modalImage.src = src;
}

function closeModal() {
  modal.style.display = "none";
}

imagenesProducto.forEach((item) => {
  item.addEventListener("click", () => openModal(item.src));
});

closeBtn.addEventListener("click", closeModal);

// Cierra el modal cuando se hace clic fuera de la imagen
window.addEventListener("click", function (event) {
  if (event.target == modal) {
    closeModal();
  }
});

inicializarArrays();
cargarProductosTodos();
