function doLogin(){
  var e = document.getElementById('l-email').value.trim();
  var p = document.getElementById('l-pass').value;
  ['el-email','el-pass'].forEach(function(id){ document.getElementById(id).classList.remove('show'); });
  ['l-email','l-pass'].forEach(function(id){ document.getElementById(id).classList.remove('err'); });
  var ok = true;
  if(!e||!e.includes('@')){
    document.getElementById('l-email').classList.add('err');
    document.getElementById('el-email').classList.add('show');
    ok=false;
  }
  if(!p){
    document.getElementById('l-pass').classList.add('err');
    document.getElementById('el-pass').textContent='Ingresa tu contrasena';
    document.getElementById('el-pass').classList.add('show');
    ok=false;
  }
  if(!ok) return;
  var u = USERS.find(function(x){ return x.email===e && x.pass===p; });
  if(!u){
    document.getElementById('l-pass').classList.add('err');
    document.getElementById('el-pass').textContent='Correo o contrasena incorrectos';
    document.getElementById('el-pass').classList.add('show');
    return;
  }
  if(!u.active){
    document.getElementById('l-pass').classList.add('err');
    document.getElementById('el-pass').textContent='Esta cuenta ha sido desactivada por el administrador';
    document.getElementById('el-pass').classList.add('show');
    return;
  }
  CU = u;
  saveSession(CU);
  loadUserProducts(CU.id); // Carga el inventario exclusivo de este usuario
  document.getElementById('l-ok').classList.add('show');
  setTimeout(function(){
    document.getElementById('l-ok').classList.remove('show');
    window.location.href = 'app_empre.html';
  }, 900);
}

function doLogout(){
  CU = null;
  PRODUCTS = {};
  saveSession(null);
  window.location.href = 'login.html';
}