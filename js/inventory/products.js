function renderProds(){
  var tbody=document.getElementById('prods-tbody'); if(!tbody) return;
  var names=Object.keys(PRODUCTS);
  setText('dash-total', names.length);

  if(names.length===0){
    tbody.innerHTML='<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--muted);font-size:13px">No hay productos aun. Haz clic en "Agregar producto" para comenzar.</td></tr>';
    var sel=document.getElementById('alert-prod-sel'); if(sel) sel.innerHTML='<option value="">Sin productos</option>';
    updateSysCounts(); return;
  }

  tbody.innerHTML = names.map(function(name){
    var p=PRODUCTS[name], qty=p.qty;
    var qs=qty<=p.min?'color:var(--red);font-weight:700':'';
    var ne=name.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    return '<tr data-name="'+name+'">'
      +'<td><div class="prod-ico"><svg viewBox="0 0 24 24" fill="currentColor" style="color:var(--b2)"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.58 15.91.48 13.33.54 11.36.07 9.5 1.99 9.5 4.5H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5-2c.83 0 1.5.67 1.5 1.5S15.83 7 15 7s-1.5-.67-1.5-1.5S14.17 4 15 4zm2 16H8V9h2v1c0 .55.45 1 1 1s1-.45 1-1V9h2v1c0 .55.45 1 1 1s1-.45 1-1V9h2v11z"/></svg></div></td>'
      +'<td style="font-weight:500">'+name+'</td><td style="color:var(--muted)">'+p.desc+'</td>'
      +'<td style="'+qs+'">'+qty+(qty<=p.min?' &#9888;':'')+'</td><td>'+fmt(p.price)+'</td>'
      +'<td><div class="act-btns" style="justify-content:center">'
      +'<button class="act-btn btn-view" onclick="openDetail(\''+ne+'\')" title="Ver detalles del producto"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg></button>'
      +'<button class="act-btn btn-edit" onclick="openEditProd(\''+ne+'\')" title="Editar producto"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>'
      +'<button class="act-btn btn-del" onclick="pedirEliminar(\''+ne+'\')" title="Eliminar producto"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>'
      +'</div></td></tr>';
  }).join('');

  var opts='<option value="">Seleccionar producto</option>'+names.map(function(n){ return '<option>'+n+'</option>'; }).join('');
  var sel=document.getElementById('alert-prod-sel'); if(sel) sel.innerHTML=opts;
  updateSysCounts();
}

function filterProds(q){
  var rows=document.querySelectorAll('#prods-tbody tr'), any=false;
  rows.forEach(function(r){ var n=r.getAttribute('data-name')||'', vis=n.toLowerCase().includes(q.toLowerCase()); r.style.display=vis?'':'none'; if(vis) any=true; });
  var nr=document.getElementById('no-results'); if(nr) nr.style.display=(q&&!any)?'block':'none';
}

function openProdModal(){
  setText('mo-prod-ttl','Agregar producto');
  ['mp-name','mp-desc','mp-price'].forEach(function(id){ setVal(id,''); document.getElementById(id).classList.remove('err'); });
  setVal('mp-qty','1'); setVal('mp-min','10'); setVal('mp-editing','');
  ['mp-name-err','mp-desc-err','mp-qty-err','mp-price-err'].forEach(function(id){ document.getElementById(id).classList.remove('show'); });
  openModal('mo-product');
}

function openEditProd(name){
  var p=PRODUCTS[name]; if(!p) return;
  setText('mo-prod-ttl','Editar: '+name);
  setVal('mp-name',name); setVal('mp-desc',p.desc); setVal('mp-qty',p.qty);
  setVal('mp-price',p.price); setVal('mp-min',p.min); setVal('mp-editing',name);
  openModal('mo-product');
}

function saveProd(){
  var nm=document.getElementById('mp-name').value.trim(), desc=document.getElementById('mp-desc').value.trim();
  var qty=parseInt(document.getElementById('mp-qty').value)||0, price=parseFloat(document.getElementById('mp-price').value)||0;
  var min=parseInt(document.getElementById('mp-min').value)||10, editing=document.getElementById('mp-editing').value;
  var ok=true;
  if(!nm){ document.getElementById('mp-name').classList.add('err'); document.getElementById('mp-name-err').classList.add('show'); ok=false; }
  else { document.getElementById('mp-name').classList.remove('err'); document.getElementById('mp-name-err').classList.remove('show'); }
  if(!desc){ document.getElementById('mp-desc').classList.add('err'); document.getElementById('mp-desc-err').classList.add('show'); ok=false; }
  else { document.getElementById('mp-desc').classList.remove('err'); document.getElementById('mp-desc-err').classList.remove('show'); }
  if(qty<0){ document.getElementById('mp-qty-err').classList.add('show'); ok=false; }
  else document.getElementById('mp-qty-err').classList.remove('show');
  if(!price||price<=0){ document.getElementById('mp-price').classList.add('err'); document.getElementById('mp-price-err').classList.add('show'); ok=false; }
  else { document.getElementById('mp-price').classList.remove('err'); document.getElementById('mp-price-err').classList.remove('show'); }
  if(!ok) return;
  if(editing && editing!==nm && PRODUCTS[editing]) delete PRODUCTS[editing];
  var existHist=(editing && PRODUCTS[nm] && editing===nm) ? PRODUCTS[nm].hist : [{t:'Entrada',q:qty,d:new Date().toISOString().split('T')[0],n:'Stock inicial'}];
  PRODUCTS[nm]={desc:desc,qty:qty,price:price,min:min,hist:existHist};
  saveProducts(); renderProds(); renderAlerts(); closeModal('mo-product');
  toast(editing?'Producto actualizado correctamente':'Producto creado exitosamente','success');
}

function pedirEliminar(name){ delTarget=name; document.getElementById('confirm-prod-name').textContent=name; openModal('mo-confirm'); }

function confirmarEliminar(){
  if(!delTarget) return;
  delete PRODUCTS[delTarget]; saveProducts(); delTarget=null;
  closeModal('mo-confirm'); renderProds(); renderAlerts();
  toast('Producto eliminado correctamente','success');
}

function openDetail(name){
  var p=PRODUCTS[name]; if(!p) return;
  var ti=p.hist.filter(function(h){ return h.t==='Entrada'; }).reduce(function(a,h){ return a+h.q; },0);
  var to=p.hist.filter(function(h){ return h.t==='Salida'; }).reduce(function(a,h){ return a+h.q; },0);
  setText('det-name',name);
  var se=document.getElementById('det-stock'); if(se){ se.textContent=p.qty; se.style.color=p.qty<=p.min?'var(--red)':'var(--g1)'; }
  var he=document.getElementById('det-stock-hint'); if(he){ he.textContent=p.qty<=p.min?'Por debajo del minimo':'Stock suficiente'; he.style.color=p.qty<=p.min?'var(--red)':'var(--g1)'; }
  setText('det-price',fmt(p.price)); setText('det-in','+'+ti); setText('det-out','-'+to);
  setText('det-in2','+'+ti); setText('det-out2','-'+to); setText('det-stock2',p.qty); setText('det-min',p.min); setText('det-desc',p.desc);
  var hb=document.getElementById('det-hist-body');
  if(hb) hb.innerHTML=p.hist.map(function(h){
    return '<tr><td><span class="badge '+(h.t==='Entrada'?'b-grn':'b-red')+'">'+h.t+'</span></td>'
      +'<td class="'+(h.t==='Entrada'?'mov-in':'mov-out')+'">'+(h.t==='Entrada'?'+':'-')+h.q+'</td>'
      +'<td>'+h.d+'</td><td>'+h.n+'</td></tr>';
  }).join('');
  gp('pg-detail',null);
}