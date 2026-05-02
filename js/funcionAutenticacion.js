var DEFAULT_USERS = [
  {id:1, email:'demo@stockeasy.com', pass:'1234', name:'Maria Cardona', biz:'Tienda La Esperanza', tel:'3001234567', active:true}
];

var USERS = {};
var CU = null;

function loadStorage(){
  try {
    var su = localStorage.getItem('stockeasy_users');
    USERS = su ? JSON.parse(su) : DEFAULT_USERS.map(function(u){ return Object.assign({},u); });

    var ss = localStorage.getItem('stockeasy_session');
    if(ss){
      var sd = JSON.parse(ss);
      CU = USERS.find(function(u){ return u.id===sd.id && u.active; }) || null;
    }
  } catch(e){}
}

function saveUsers(){
  localStorage.setItem('stockeasy_users', JSON.stringify(USERS));
}

function saveSession(user){
  if(user) localStorage.setItem('stockeasy_session', JSON.stringify({id:user.id}));
  else localStorage.removeItem('stockeasy_session');
}

function doLogin(){
  var e = document.getElementById('l-email').value.trim();
  var p = document.getElementById('l-pass').value;

  var u = USERS.find(function(x){ return x.email===e && x.pass===p; });

  if(!u) return;

  CU = u;
  saveSession(CU);
}

function doLogout(){
  CU = null;
  saveSession(null);
}

function doRegister(){
  var nm  = document.getElementById('r-name').value.trim();
  var em  = document.getElementById('r-email').value.trim();
  var ps  = document.getElementById('r-pass').value;
  var bz  = document.getElementById('r-biz').value.trim();
  var tel = document.getElementById('r-tel').value.trim();

  var newUser = {
    id:Date.now(),
    email:em,
    pass:ps,
    name:nm,
    biz:bz,
    tel:tel,
    active:true
  };

  USERS.push(newUser);
  saveUsers();
}

function doRecover(){
  var e = document.getElementById('rec-email').value.trim();
}