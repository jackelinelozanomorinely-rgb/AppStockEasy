function loadUser(){
  if(!CU) return;
  var ini = CU.name.split(' ').map(function(w){ return w[0]; }).join('').substring(0,2).toUpperCase();
  ['sb-av','pav'].forEach(function(id){ var el=document.getElementById(id); if(el) el.textContent=ini; });
  setText('sb-nm', CU.name);  setText('sb-bz', CU.biz);  setText('sb-em', CU.email);
  setText('p-nm',  CU.name);  setText('p-em',  CU.email); setText('p-bz',  CU.biz);
  setText('p-tel', CU.tel||'No registrado');
  setVal('edit-email', CU.email); setVal('edit-biz', CU.biz); setVal('edit-tel', CU.tel||'');
}

function toggleEdit(){
  editMode = !editMode;
  ['edit-email','edit-biz','edit-tel'].forEach(function(id){
    var el=document.getElementById(id); if(el) el.disabled=!editMode;
  });
  var sb=document.getElementById('save-prof-btn'); if(sb) sb.style.display=editMode?'block':'none';
}

function saveProfile(){
  if(!CU) return;
  var em  = document.getElementById('edit-email').value.trim();
  var bz  = document.getElementById('edit-biz').value.trim();
  var tel = document.getElementById('edit-tel').value.trim();
  if(!em||!em.includes('@')){ toast('Correo invalido','error'); return; }
  if(!bz){ toast('El nombre del emprendimiento no puede estar vacio','error'); return; }
  var dup = USERS.find(function(u){ return u.email===em && u.id!==CU.id; });
  if(dup){ toast('Ese correo ya esta en uso por otro usuario','error'); return; }
  CU.email=em; CU.biz=bz; CU.tel=tel;
  saveUsers(); saveSession(CU); loadUser(); toggleEdit();
  toast('Perfil actualizado correctamente','success');
}

function cambiarContrasena(){
  var cur=document.getElementById('pwd-cur').value, nw=document.getElementById('pwd-new').value, nw2=document.getElementById('pwd-new2').value;
  var errEl=document.getElementById('pwd-err'); errEl.classList.remove('show');
  if(!cur||!CU||cur!==CU.pass){ errEl.textContent='Contrasena actual incorrecta'; errEl.classList.add('show'); return; }
  if(nw.length<6){ errEl.textContent='La nueva contrasena debe tener al menos 6 caracteres'; errEl.classList.add('show'); return; }
  if(nw!==nw2){ errEl.textContent='Las contrasenas nuevas no coinciden'; errEl.classList.add('show'); return; }
  CU.pass=nw; saveUsers();
  ['pwd-cur','pwd-new','pwd-new2'].forEach(function(id){ document.getElementById(id).value=''; });
  toast('Contrasena actualizada correctamente','success');
}