var _tt;
function toast(msg,type){
  var t=document.getElementById('toast'); if(!t) return;
  t.textContent=msg; t.className=type||''; t.style.display='block';
  clearTimeout(_tt); _tt=setTimeout(function(){ t.style.display='none'; },3200);
}