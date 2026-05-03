function renderAlerts(){
  var container=document.getElementById('alerts-list'); if(!container) return;
  var alerts=[];
  Object.keys(PRODUCTS).forEach(function(name){
    var p=PRODUCTS[name];
    if(p.qty<=p.min) alerts.push({name:name,qty:p.qty,min:p.min,type:'bajo'});
    else if(p.qty>p.min*5) alerts.push({name:name,qty:p.qty,min:p.min,type:'alto'});
  });
  var badgeEl=document.getElementById('alert-badge');
  var lowCount=alerts.filter(function(a){ return a.type==='bajo'; }).length;
  if(badgeEl){ badgeEl.textContent=lowCount||''; badgeEl.style.display=lowCount?'':'none'; }
  if(!alerts.length){
    container.innerHTML='<div style="text-align:center;padding:30px;color:var(--muted);font-size:13px;background:white;border-radius:10px;border:.5px solid var(--border)">Sin alertas activas. Todo el inventario esta en orden.</div>';
    return;
  }
  container.innerHTML=alerts.map(function(a){
    var isLow=a.type==='bajo';
    return '<div class="alert-card"><div class="alert-ico '+(isLow?'ico-red':'ico-amb')+'">'
      +'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg></div>'
      +'<div style="flex:1"><div style="font-size:13px;font-weight:600">'+a.name+' &mdash; Stock '+(isLow?'bajo':'alto')+'</div>'
      +'<div style="font-size:11px;color:var(--muted);margin-top:2px">'+a.qty+' unidades. '+(isLow?'Limite minimo: '+a.min+' unidades':'Considera reducir compras')+'</div></div>'
      +'<span class="badge '+(isLow?'b-red':'b-amb')+'">'+(isLow?'Urgente':'Revisar')+'</span></div>';
  }).join('');
}

function guardarLimite(){
  var prod=document.getElementById('alert-prod-sel').value, min=parseInt(document.getElementById('alert-min-val').value)||0;
  if(!prod){ toast('Selecciona un producto','error'); return; }
  if(min<=0){ toast('El limite minimo debe ser mayor a 0','error'); return; }
  PRODUCTS[prod].min=min; saveProducts(); renderAlerts(); renderProds();
  setVal('alert-min-val','');
  toast('Limite configurado para '+prod+': '+min+' unidades','success');
}