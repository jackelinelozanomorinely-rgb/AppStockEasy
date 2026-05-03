function renderAdminUsers(){
  var grid=document.getElementById('users-grid'); if(!grid) return;
  var total=USERS.length, active=USERS.filter(function(u){ return u.active; }).length, inactive=total-active;
  setText('adm-total-users',total); setText('adm-active-users',active); setText('adm-inactive-users',inactive);
  setText('sys-active',active); setText('sys-total-users',total);
  grid.innerHTML=USERS.map(function(u){
    var ini=u.name.split(' ').map(function(w){ return w[0]; }).join('').substring(0,2).toUpperCase();
    var prodCount=0;
    try{ var up=localStorage.getItem('stockeasy_products_'+u.id); if(up) prodCount=Object.keys(JSON.parse(up)).length; }catch(e){}
    return '<div class="user-card">'
      +'<div class="uca">'+ini+'</div>'
      +'<div style="font-weight:600;font-size:13px">'+u.name+'</div>'
      +'<div style="font-size:11px;color:var(--muted);margin-top:1px">'+u.email+'</div>'
      +'<div style="font-size:11px;color:var(--b2);margin-top:2px">'+u.biz+'</div>'
      +'<div style="font-size:11px;color:#888;margin-top:1px">'+(u.tel||'Sin telefono')+'</div>'
      +'<div style="font-size:10px;color:var(--muted);margin-top:2px">Productos: <b>'+prodCount+'</b></div>'
      +'<span class="uc-status '+(u.active?'uc-act':'uc-des')+'" style="margin-top:5px;display:inline-block">'+(u.active?'Activo':'Desactivado')+'</span>'
      +'<div style="display:flex;gap:6px;margin-top:10px">'
      +'<button class="act-btn btn-view" onclick="verDetalleUsuario('+u.id+')" title="Ver detalles" style="flex:1;width:auto;padding:0 8px;font-size:11px;font-weight:600;gap:4px">'
      +'<svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>Ver</button>'
      +'<button class="act-btn '+(u.active?'btn-del':'btn-view')+'" onclick="toggleUserById('+u.id+')" title="'+(u.active?'Desactivar':'Activar')+' usuario" style="flex:1;width:auto;padding:0 8px;font-size:11px;font-weight:600;gap:4px">'
      +'<svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">'+(u.active?'<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>':'<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>')+'</svg>'+(u.active?'Desactivar':'Activar')+'</button>'
      +'</div></div>';
  }).join('');
}

function verDetalleUsuario(id){
  var u=USERS.find(function(x){ return x.id===id; }); if(!u) return;
  admViewUser=u;
  var ini=u.name.split(' ').map(function(w){ return w[0]; }).join('').substring(0,2).toUpperCase();
  var prodCount=0, movCount=0;
  try{
    var up=localStorage.getItem('stockeasy_products_'+u.id);
    if(up){ var prods=JSON.parse(up); prodCount=Object.keys(prods).length; movCount=Object.values(prods).reduce(function(a,p){ return a+p.hist.length; },0); }
  }catch(e){}
  setText('adm-det-name',u.name); setText('adm-det-av',ini); setText('adm-det-nm',u.name);
  setText('adm-det-em',u.email); setText('adm-det-bz',u.biz); setText('adm-det-tel',u.tel||'No registrado');
  setText('adm-det-status',u.active?'Activo':'Desactivado');
  var se=document.getElementById('adm-det-status'); if(se) se.className='uc-status '+(u.active?'uc-act':'uc-des');
  setText('adm-det-prods',prodCount); setText('adm-det-movs',movCount);
  var btn=document.getElementById('adm-toggle-btn');
  if(btn){ btn.textContent=u.active?'Desactivar usuario':'Activar usuario'; btn.style.background=u.active?'linear-gradient(135deg,#8C2A2A,var(--red))':'linear-gradient(135deg,var(--g1),var(--g2))'; }
  gap('ag-user-detail',null);
}

function toggleUserStatus(){
  if(!admViewUser) return;
  admViewUser.active=!admViewUser.active; saveUsers();
  verDetalleUsuario(admViewUser.id); renderAdminUsers(); updateSysCounts();
  toast('Usuario '+(admViewUser.active?'activado':'desactivado')+' correctamente',admViewUser.active?'success':'error');
}

function toggleUserById(id){
  var u=USERS.find(function(x){ return x.id===id; }); if(!u) return;
  u.active=!u.active; saveUsers(); renderAdminUsers(); updateSysCounts();
  toast('Usuario '+u.name+' '+(u.active?'activado':'desactivado'),u.active?'success':'error');
}

function updateSysCounts(){
  var el=document.getElementById('sys-prods'); if(el) el.textContent=Object.keys(PRODUCTS).length;
  var ea=document.getElementById('sys-active'); if(ea) ea.textContent=USERS.filter(function(u){ return u.active; }).length;
  var et=document.getElementById('sys-total-users'); if(et) et.textContent=USERS.length;
}