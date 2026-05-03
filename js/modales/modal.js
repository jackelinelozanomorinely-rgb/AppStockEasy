function openModal(id){ var el=document.getElementById(id); if(el) el.classList.add('open'); }
function closeModal(id){ var el=document.getElementById(id); if(el) el.classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(function(m){
  m.addEventListener('click',function(e){ if(e.target===this) this.classList.remove('open'); });
});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape') document.querySelectorAll('.modal-overlay.open').forEach(function(m){ m.classList.remove('open'); });
});