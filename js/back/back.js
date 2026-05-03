function respaldarDatos(){
  var allData={fecha:new Date().toISOString(),usuarios:USERS,inventarios:{}};
  USERS.forEach(function(u){
    try{ var s=localStorage.getItem('stockeasy_products_'+u.id); allData.inventarios[u.email]=s?JSON.parse(s):{}; }catch(e){}
  });
  var json=JSON.stringify(allData,null,2);
  var blob=new Blob([json],{type:'application/json'});
  var url=window.URL.createObjectURL(blob);
  var link=document.createElement('a');
  link.href=url; link.download='respaldo-stockeasy-'+new Date().toISOString().split('T')[0]+'.json';
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
  toast('Respaldo descargado correctamente','success');
}