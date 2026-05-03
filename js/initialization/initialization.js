loadStorage();       // Carga usuarios y sesion desde localStorage
renderProds();       // Tabla de productos (vacia si usuario nuevo)
renderAlerts();      // Panel de alertas
renderAdminUsers();  // Panel admin

// Si habia sesion guardada, retomar directamente la app
if(CU){
  loadUser();
  show('scr-app');
}