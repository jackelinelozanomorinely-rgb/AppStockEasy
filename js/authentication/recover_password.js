function doRecover(){
  var e = document.getElementById('rec-email').value.trim();
  document.getElementById('rec-email').classList.remove('err');
  document.getElementById('erec').classList.remove('show');
  if(!e||!e.includes('@')){
    document.getElementById('rec-email').classList.add('err');
    document.getElementById('erec').textContent='Ingresa un correo valido';
    document.getElementById('erec').classList.add('show');
    return;
  }
  if(!USERS.find(function(u){ return u.email===e; })){
    document.getElementById('rec-email').classList.add('err');
    document.getElementById('erec').textContent='Correo no encontrado en el sistema';
    document.getElementById('erec').classList.add('show');
    return;
  }
  document.getElementById('rec-ok').classList.add('show');
}
