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

    // ─── VERIFICAR BLOQUEO POR INTENTOS FALLIDOS ───
    var attemptKey = 'loginAttempts_' + e;
    var attempts = parseInt(localStorage.getItem(attemptKey) || '0');
  
    if(attempts >= 4){
    document.getElementById('l-pass').classList.add('err');
      document.getElementById('el-pass').textContent='❌ Cuenta bloqueada. Demasiados intentos fallidos. Intenta más tarde.';
    document.getElementById('el-pass').classList.add('show');
    return;
  }

    // ─── BUSCAR USUARIO ───
    var u = USERS.find(function(x){ return x.email===e && x.pass===p; });
  
    if(!u){
      // ─── CREDENCIALES INCORRECTAS: INCREMENTAR INTENTOS ───
      attempts++;
      localStorage.setItem(attemptKey, attempts);
    
      document.getElementById('l-pass').classList.add('err');
      if(attempts < 4){
        document.getElementById('el-pass').textContent='Correo o contraseña incorrectos. Intentos restantes: ' + (4 - attempts);
      } else {
        document.getElementById('el-pass').textContent='❌ Cuenta bloqueada por intentos fallidos.';
      }
      document.getElementById('el-pass').classList.add('show');
      return;
    }
  if(!u.active){
      // ─── CUENTA DESACTIVADA: INCREMENTAR INTENTOS ───
      attempts++;
      localStorage.setItem(attemptKey, attempts);
    
    document.getElementById('l-pass').classList.add('err');
    document.getElementById('el-pass').textContent='Esta cuenta ha sido desactivada por el administrador';
    document.getElementById('el-pass').classList.add('show');
    return;
  }
    
    // ─── LOGIN EXITOSO: RESETEAR INTENTOS Y GUARDAR SESIÓN ───
  localStorage.removeItem(attemptKey);
    
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