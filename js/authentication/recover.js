// ======== RECUPERAR CONTRASEÑA - MEJORADO ========

// Cambiar entre tabs de recuperación (Email / Teléfono)
function switchRecoveryTab(tab){
  // Ocultar/mostrar formularios
  document.getElementById('recover-email-form').style.display = tab === 'email' ? 'block' : 'none';
  document.getElementById('recover-phone-form').style.display = tab === 'phone' ? 'block' : 'none';
  
  // Limpiar mensajes
  document.getElementById('erec').classList.remove('show');
  document.getElementById('erph').classList.remove('show');
  document.getElementById('rec-email').classList.remove('err');
  document.getElementById('rec-phone').classList.remove('err');
  document.getElementById('recover-result').style.display = 'none';
  document.getElementById('rec-ok').classList.remove('show');
  
  // Cambiar estilos del tab
  document.querySelectorAll('.tab-btn').forEach(function(btn, idx){
    if((tab === 'email' && idx === 0) || (tab === 'phone' && idx === 1)){
      btn.style.borderBottomColor = 'var(--p1)';
      btn.style.color = 'var(--p1)';
    } else {
      btn.style.borderBottomColor = 'transparent';
      btn.style.color = '#888';
    }
  });
}

// Recuperar contraseña por CORREO ELECTRÓNICO
function doRecoverByEmail(){
  var email = document.getElementById('rec-email').value.trim();
  
  // Limpiar errores previos
  document.getElementById('rec-email').classList.remove('err');
  document.getElementById('erec').classList.remove('show');
  document.getElementById('recover-result').style.display = 'none';
  
  // Validar email
  if(!email || !email.includes('@')){
    document.getElementById('rec-email').classList.add('err');
    document.getElementById('erec').textContent = 'Ingresa un correo válido';
    document.getElementById('erec').classList.add('show');
    return;
  }
  
  // Buscar usuario en USERS
  var user = USERS.find(function(u){ return u.email === email; });
  
  if(!user){
    document.getElementById('rec-email').classList.add('err');
    document.getElementById('erec').textContent = 'Correo no encontrado en el sistema';
    document.getElementById('erec').classList.add('show');
    return;
  }
  
  // ✅ Correo encontrado: Mostrar contraseña
  showRecoveredPassword(user.pass);
}

// Recuperar contraseña por TELÉFONO
function doRecoverByPhone(){
  var phone = document.getElementById('rec-phone').value.trim();
  
  // Limpiar errores previos
  document.getElementById('rec-phone').classList.remove('err');
  document.getElementById('erph').classList.remove('show');
  document.getElementById('recover-result').style.display = 'none';
  
  // Validar teléfono (al menos 7 caracteres)
  if(!phone || phone.length < 7){
    document.getElementById('rec-phone').classList.add('err');
    document.getElementById('erph').textContent = 'Ingresa un teléfono válido';
    document.getElementById('erph').classList.add('show');
    return;
  }
  
  // Buscar usuario en USERS por teléfono
  var user = USERS.find(function(u){ return u.tel && u.tel.trim() === phone; });
  
  if(!user){
    document.getElementById('rec-phone').classList.add('err');
    document.getElementById('erph').textContent = 'Teléfono no encontrado en el sistema';
    document.getElementById('erph').classList.add('show');
    return;
  }
  
  // ✅ Teléfono encontrado: Mostrar contraseña
  showRecoveredPassword(user.pass);
}

// Mostrar la contraseña recuperada en pantalla
function showRecoveredPassword(password){
  document.getElementById('recover-password-display').textContent = password;
  document.getElementById('recover-result').style.display = 'block';
  document.getElementById('rec-ok').classList.add('show');
}

// Copiar contraseña recuperada al portapapeles
function copyRecoveredPassword(button){
  var password = document.getElementById('recover-password-display').textContent;
  if(!password || password === '••••••') return;
  
  // Copiar al portapapeles con fallback a execCommand
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(password).catch(function(){
      copyFallback(password);
    });
  } else {
    copyFallback(password);
  }
  
  // Mostrar confirmación
  var originalText = button.textContent;
  button.textContent = '✓ Copiado';
  button.style.background = '#10b981';
  setTimeout(function(){
    button.textContent = originalText;
    button.style.background = '#0ea5e9';
  }, 2000);
}

function copyFallback(text){
  var textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

// Mantener doRecover() por compatibilidad (por si se llama desde otra parte)
function doRecover(){
  doRecoverByEmail();
}