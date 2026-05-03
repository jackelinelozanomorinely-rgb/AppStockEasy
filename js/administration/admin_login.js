function doAdminLogin(){
  var e = document.getElementById('a-email').value.trim();
  var p = document.getElementById('a-pass').value;
  document.getElementById('ea-err').classList.remove('show');
  if(e==='admin@stockeasy.com' && p==='admin123'){
    document.getElementById('a-ok').classList.add('show');
    renderAdminUsers();
    updateSysCounts();
    setTimeout(function(){
      document.getElementById('a-ok').classList.remove('show');
      window.location.href = 'app_admin.html';
    }, 800);
  } else {
    document.getElementById('ea-err').classList.add('show');
  }
}

// Acceso oculto: doble clic en esquina inferior derecha del login
var admCorner = document.getElementById('adm-corner');
if(admCorner){
  admCorner.addEventListener('dblclick', function(){ window.location.href = 'admin_login.html'; });
}
