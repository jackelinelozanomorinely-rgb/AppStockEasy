// ======== RECUPERAR CONTRASEÑA ========

function doRecover(){
  // Capturamos el correo ingresado por el usuario
  var e = document.getElementById('rec-email').value.trim();
  
  // Limpiamos errores previos para que la interfaz se vea limpia
  document.getElementById('rec-email').classList.remove('err');
  document.getElementById('erec').classList.remove('show');
  
  // Validamos que el campo no esté vacío y que tenga formato de correo
  if(!e || !e.includes('@')){
    document.getElementById('rec-email').classList.add('err');
    document.getElementById('erec').textContent = 'Ingresa un correo válido';
    document.getElementById('erec').classList.add('show');
    return;
  }
  
  // Buscamos si el correo existe en nuestra lista global de usuarios
  // USERS viene del archivo main.js que cargamos previamente
  var userExists = USERS.find(function(u){ return u.email === e; });
  
  if(!userExists){
    document.getElementById('rec-email').classList.add('err');
    document.getElementById('erec').textContent = 'Correo no encontrado en el sistema';
    document.getElementById('erec').classList.add('show');
    return;
  }
  
  // Si todo está bien, mostramos el mensaje de éxito (el check verde)
  document.getElementById('rec-ok').classList.add('show');
  
  // Opcional: Podrías redirigir al login después de unos segundos
  /*
  setTimeout(function(){
    location.href = 'login.html';
  }, 3000);
  */
}