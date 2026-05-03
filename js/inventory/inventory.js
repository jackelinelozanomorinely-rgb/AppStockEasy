(function initDates(){
  var today=new Date().toISOString().split('T')[0];
  var i1=document.getElementById('inv-in-date'); if(i1) i1.value=today;
  var i2=document.getElementById('inv-out-date'); if(i2) i2.value=today;
})();

function invTab(t,el){
  document.querySelectorAll('.tabs .tab').forEach(function(x){ x.classList.remove('active'); });
  if(el) el.classList.add('active');
  ['iv-entrada','iv-salida','iv-historial'].forEach(function(id){ document.getElementById(id).style.display='none'; });
  var map={entrada:'iv-entrada',salida:'iv-salida',historial:'iv-historial'};
  var target=document.getElementById(map[t]); if(target) target.style.display='';
}

function showProdSug(q,sugId){
  var sug=document.getElementById(sugId); if(!sug) return;
  if(!q){ sug.style.display='none'; return; }
  var matches=Object.keys(PRODUCTS).filter(function(n){ return n.toLowerCase().includes(q.toLowerCase()); });
  if(!matches.length){ sug.style.display='none'; return; }
  var inputId=sugId==='sug-in'?'inv-in-prod':'inv-out-prod';
  sug.innerHTML=matches.map(function(n){
    var ne=n.replace(/'/g,"\\'");
    return '<div style="padding:10px 14px;cursor:pointer;font-size:13px;border-bottom:.5px solid #f5f5f5"'
      +' onmousedown="document.getElementById(\''+inputId+'\').value=\''+ne+'\';document.getElementById(\''+sugId+'\').style.display=\'none\'">'
      +'<b>'+n+'</b> <span style="color:var(--muted);font-size:11px;margin-left:8px">Stock: '+PRODUCTS[n].qty+'</span></div>';
  }).join('');
  sug.style.display='block';
}

function changeQty(id,d){ var inp=document.getElementById(id); if(!inp) return; inp.value=Math.max(0,(parseInt(inp.value)||0)+d); }

function registrarEntrada(){
  var prod=document.getElementById('inv-in-prod').value.trim(), qty=parseInt(document.getElementById('inv-in-qty').value)||0;
  var date=document.getElementById('inv-in-date').value, nota=document.getElementById('inv-in-nota').value.trim()||'Sin nota';
  if(!prod||!PRODUCTS[prod]){ toast('Selecciona un producto valido de la lista','error'); return; }
  if(qty<=0){ toast('La cantidad debe ser mayor a 0','error'); return; }
  if(!date){ toast('Ingresa la fecha de entrada','error'); return; }
  PRODUCTS[prod].qty+=qty; PRODUCTS[prod].hist.unshift({t:'Entrada',q:qty,d:date,n:nota});
  saveProducts(); addHistRow(prod,'Entrada','+'+qty,date,nota);
  setVal('inv-in-prod',''); setVal('inv-in-qty',1); setVal('inv-in-nota','');
  var si=document.getElementById('sug-in'); if(si) si.style.display='none';
  renderProds(); renderAlerts();
  toast('Entrada registrada. Stock actualizado a '+PRODUCTS[prod].qty+' unidades.','success');
}

function registrarSalida(){
  var prod=document.getElementById('inv-out-prod').value.trim(), qty=parseInt(document.getElementById('inv-out-qty').value)||0;
  var date=document.getElementById('inv-out-date').value, nota=document.getElementById('inv-out-nota').value.trim()||'Sin nota';
  if(!prod||!PRODUCTS[prod]){ toast('Selecciona un producto valido de la lista','error'); return; }
  if(qty<=0){ toast('La cantidad debe ser mayor a 0','error'); return; }
  if(qty>PRODUCTS[prod].qty){ toast('Stock insuficiente. Solo hay '+PRODUCTS[prod].qty+' unidades disponibles','error'); return; }
  if(!date){ toast('Ingresa la fecha de salida','error'); return; }
  PRODUCTS[prod].qty-=qty; PRODUCTS[prod].hist.unshift({t:'Salida',q:qty,d:date,n:nota});
  saveProducts(); addHistRow(prod,'Salida','-'+qty,date,nota);
  setVal('inv-out-prod',''); setVal('inv-out-qty',1); setVal('inv-out-nota','');
  var so=document.getElementById('sug-out'); if(so) so.style.display='none';
  renderProds(); renderAlerts();
  toast('Salida registrada. Stock actualizado a '+PRODUCTS[prod].qty+' unidades.','success');
}

function addHistRow(prod,tipo,qty,date,nota){
  var tbody=document.getElementById('hist-tbody'); if(!tbody) return;
  var tr=document.createElement('tr');
  tr.innerHTML='<td>'+prod+'</td><td><span class="badge '+(tipo==='Entrada'?'b-grn':'b-red')+'">'+tipo+'</span></td>'
    +'<td class="'+(tipo==='Entrada'?'mov-in':'mov-out')+'">'+qty+'</td><td>'+date+'</td><td>'+nota+'</td>';
  tbody.prepend(tr);
}
