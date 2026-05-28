// ==========================
// DATOS USUARIOS
// ==========================

let users = [

  {
    id:1,
    nombre:"Maria Cardona",
    email:"demo@stockeasy.com",
    tienda:"Tienda Esperanza",
    telefono:"3001234567",
    productos:2,
    movimientos:5,
    activo:true
  }

];
function downloadExcel(id){

  // buscar usuario
  const user = users.find(u => u.id === id);

  // obtener productos guardados
  // clave única por usuario

  const productos =
    JSON.parse(
      localStorage.getItem(
        `productos_${user.id}`
      )
    ) || [];



  // validar
  if(productos.length === 0){

    alert("Este emprendedor no tiene productos");

    return;
  }


  // convertir datos excel
  const data = productos.map(prod => ({

    Producto: prod.nombre,

    Categoria: prod.categoria,

    Stock: prod.stock,

    Precio: prod.precio

  }));



  // crear hoja
  const worksheet =
    XLSX.utils.json_to_sheet(data);


  // crear libro
  const workbook =
    XLSX.utils.book_new();



  // agregar hoja
  XLSX.utils.book_append_sheet(

    workbook,

    worksheet,

    "Productos"

  );



  // descargar archivo
  XLSX.writeFile(

    workbook,

    `Productos_${user.nombre}.xlsx`

  );
}

let selectedUser = null;

// ==========================
// RENDER USUARIOS
// ==========================

function renderUsers() {

  const grid = document.getElementById("users-grid");

  grid.innerHTML = "";

  users.forEach(user => {

    const initials = user.nombre
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0,2);

    grid.innerHTML += `
    
      <div class="user-card">

        <div class="user-avatar">
          ${initials}
        </div>

        <div class="user-name">
          ${user.nombre}
        </div>

        <div class="user-email">
          ${user.email}
        </div>

        <div class="user-store">
          ${user.tienda}
        </div>

        <div class="user-phone">
          ${user.telefono}
        </div>

        <div class="user-products">
          Productos: ${user.productos}
        </div>

        <div class="user-status ${user.activo ? 'status-active' : 'status-inactive'}">
          ${user.activo ? 'Activo' : 'Desactivado'}
        </div>

       <div class="user-actions">

  <button class="btn-view"
    onclick="viewUser(${user.id})">
    👁 Ver
  </button>

  <button class="btn-excel"
    onclick="downloadExcel(${user.id})">
    📥 Excel
  </button>

  <button class="btn-disable"
    onclick="toggleStatus(${user.id})">

    ${user.activo ? '⛔ Desactivar' : '✅ Activar'}

  </button>

</div>

      </div>

    `;
  });

  updateStats();
}

// ==========================
// VER USUARIO
// ==========================

function viewUser(id){

  const user = users.find(u => u.id === id);

  selectedUser = user;

  document.getElementById("adm-det-name").innerText = user.nombre;

  document.getElementById("adm-det-nm").innerText = user.nombre;

  document.getElementById("adm-det-em").innerText = user.email;

  document.getElementById("adm-det-bz").innerText = user.tienda;

  document.getElementById("adm-det-tel").innerText = user.telefono;

  document.getElementById("adm-det-prods").innerText = user.productos;

  document.getElementById("adm-det-movs").innerText = user.movimientos;

  document.getElementById("adm-det-av").innerText =
    user.nombre
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0,2);

  const status = document.getElementById("adm-det-status");

  status.innerText = user.activo ? "Activo" : "Desactivado";

  status.className = user.activo
    ? "uc-status uc-act"
    : "uc-status uc-in";

  const btn = document.getElementById("adm-toggle-btn");

  btn.innerText = user.activo
    ? "Desactivar usuario"
    : "Activar usuario";

  gap("ag-user-detail");
}

// ==========================
// ACTIVAR / DESACTIVAR
// ==========================

function toggleStatus(id){

  const user = users.find(u => u.id === id);

  user.activo = !user.activo;

  renderUsers();

  if(selectedUser && selectedUser.id === user.id){
    viewUser(user.id);
  }
}

// ==========================
// BOTON DETALLE
// ==========================

function toggleUserStatus(){

  if(selectedUser){

    selectedUser.activo = !selectedUser.activo;

    viewUser(selectedUser.id);

    renderUsers();
  }
}

// ==========================
// ESTADISTICAS
// ==========================

function updateStats(){

  const total = users.length;

  const activos = users.filter(u => u.activo).length;

  const inactivos = users.filter(u => !u.activo).length;

  document.getElementById("adm-total-users").innerText = total;

  document.getElementById("adm-active-users").innerText = activos;

  document.getElementById("adm-inactive-users").innerText = inactivos;

  document.getElementById("sys-total-users").innerText = total;

  document.getElementById("sys-active").innerText = activos;
}

// ==========================
// CAMBIO PAGINAS
// ==========================

function gap(pageId, element = null, title = ""){

  // ocultar paginas
  document.querySelectorAll(".page")
    .forEach(p => p.classList.remove("active"));

  // mostrar pagina
  document.getElementById(pageId)
    .classList.add("active");

  // sidebar activa
  if(element){

    document.querySelectorAll(".sb-item")
      .forEach(i => i.classList.remove("active"));

    element.classList.add("active");
  }

  // cambiar titulo
  if(title){

    document.getElementById("adm-ttl")
      .innerText = title;
  }
}

// ==========================
// RESPALDO
// ==========================

function respaldarDatos(){
  alert("Respaldo realizado correctamente");
}

// ==========================
// LOGOUT
// ==========================

function doLogout(){

  localStorage.removeItem('stockeasy_admin');

  window.location.href = "index.html";

}

// ==========================
// INICIO
// ==========================

renderUsers();

// ==========================
// DESCARGAR TODOS LOS EMPRENDEDORES
// ==========================

function downloadAllUsersExcel(){

  const data = users.map(user => ({

    Nombre: user.nombre,

    Email: user.email,

    Emprendimiento: user.tienda,

    Telefono: user.telefono,

    Estado: user.activo
      ? "Activo"
      : "Desactivado",

    Productos: user.productos,

    Movimientos: user.movimientos

  }));


  // CREAR HOJA
  const worksheet =
    XLSX.utils.json_to_sheet(data);


  // CREAR LIBRO
  const workbook =
    XLSX.utils.book_new();


  // AGREGAR HOJA
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Emprendedores"
  );


  // DESCARGAR
  XLSX.writeFile(
    workbook,
    "StockEasy_Emprendedores.xlsx"
  );
}