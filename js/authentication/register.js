function doRegister(){
  var nm  = document.getElementById('r-name').value.trim();
  var em  = document.getElementById('r-email').value.trim();
  var ps  = document.getElementById('r-pass').value;
  var ps2 = document.getElementById('r-pass2').value;
  var bz  = document.getElementById('r-biz').value.trim();
  var tel = document.getElementById('r-tel').value.trim();

  [['r-name','er-name'],['r-email','er-email'],['r-pass','er-pass'],
   ['r-pass2','er-pass2'],['r-biz','er-biz']].forEach(function(pair){
    document.getElementById(pair[0]).classList.remove('err');
    document.getElementById(pair[1]).classList.remove('show');
  });

  var ok = true;
  if(!nm){ document.getElementById('r-name').classList.add('err'); document.getElementById('er-name').classList.add('show'); ok=false; }
  if(!em||!em.includes('@')){
    document.getElementById('r-email').classList.add('err');
    document.getElementById('er-email').textContent='Correo no valido';
    document.getElementById('er-email').classList.add('show'); ok=false;
  } else if(USERS.find(function(u){ return u.email===em; })){
    document.getElementById('r-email').classList.add('err');
    document.getElementById('er-email').textContent='Este correo ya esta registrado';
    document.getElementById('er-email').classList.add('show'); ok=false;
  }
  if(ps.length<6){ document.getElementById('r-pass').classList.add('err'); document.getElementById('er-pass').classList.add('show'); ok=false; }
  if(ps!==ps2){ document.getElementById('r-pass2').classList.add('err'); document.getElementById('er-pass2').classList.add('show'); ok=false; }
  if(!bz){ document.getElementById('r-biz').classList.add('err'); document.getElementById('er-biz').classList.add('show'); ok=false; }
  if(!ok) return;

  var newUser = {id:Date.now(), email:em, pass:ps, name:nm, biz:bz, tel:tel, active:true};
  USERS.push(newUser);
  saveUsers();

  try { localStorage.setItem('stockeasy_products_'+newUser.id, JSON.stringify({})); }
  catch(e){}

  document.getElementById('r-ok').classList.add('show');
  setTimeout(function(){
    document.getElementById('r-ok').classList.remove('show');
    window.location.href = 'login.html';
  }, 1800);
}