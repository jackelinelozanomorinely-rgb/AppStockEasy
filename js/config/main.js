// ══════════════════════════════════════════════════════════
// CONFIG - CONFIGURACIÓN GLOBAL DE LA APLICACIÓN
// ══════════════════════════════════════════════════════════

// ═══ USUARIOS ═══
var DEFAULT_USERS = [
  {id:1, email:'demo@stockeasy.com', pass:'1234', name:'Maria Cardona', biz:'Tienda La Esperanza', tel:'3001234567', active:true}
];

var USERS = [];
var CU = null; // USUARIO ACTUAL (Current User)
var PRODUCTS = {};
var MOVEMENTS = [];
var ALERTS = [];
var admViewUser = null;
var delTarget = null;
var editMode = false;

function initStorage(){
  try {
    var su = localStorage.getItem('stockeasy_users');
    USERS = su ? JSON.parse(su) : DEFAULT_USERS.map(function(u){ return Object.assign({},u); });

    var ss = localStorage.getItem('stockeasy_session');
    if(ss){
      var sd = JSON.parse(ss);
      CU = USERS.find(function(u){ return u.id===sd.id && u.active; }) || null;
    }

    if(CU){
      loadUserProducts(CU.id);
    } else {
      PRODUCTS = {};
    }
  } catch(e){
    console.error('Error cargando datos:', e);
    USERS = DEFAULT_USERS.map(function(u){ return Object.assign({},u); });
    PRODUCTS = {};
    CU = null;
  }
}

function loadStorage(){
  initStorage();
}

function saveUsers(){
  try {
    localStorage.setItem('stockeasy_users', JSON.stringify(USERS));
  } catch(e){ console.error('Error guardando usuarios:', e); }
}

function saveProducts(){
  if(!CU) return;
  try {
    localStorage.setItem('stockeasy_products_' + CU.id, JSON.stringify(PRODUCTS));
  } catch(e){ console.error('Error guardando productos:', e); }
}

function saveSession(user){
  if(user && user.id){
    localStorage.setItem('stockeasy_session', JSON.stringify({id:user.id}));
  } else {
    localStorage.removeItem('stockeasy_session');
  }
}

function loadUserProducts(userId){
  try {
    var data = localStorage.getItem('stockeasy_products_' + userId);
    PRODUCTS = data ? JSON.parse(data) : {};
    if(typeof PRODUCTS !== 'object' || Array.isArray(PRODUCTS)){
      PRODUCTS = {};
    }
  } catch(e){
    PRODUCTS = {};
  }
}

function show(id){
  document.querySelectorAll('.screen').forEach(function(screen){ screen.classList.remove('active'); });
  var el = document.getElementById(id);
  if(el) el.classList.add('active');
}

function togglePwd(inputId, btn){
  var input = document.getElementById(inputId);
  if(!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
  if(btn) btn.setAttribute('aria-pressed', input.type !== 'password');
}

function gp(pageId, el){
  document.querySelectorAll('.page').forEach(function(page){ page.classList.remove('active'); });
  var page = document.getElementById(pageId);
  if(page) page.classList.add('active');
  document.querySelectorAll('.sb-item').forEach(function(item){ item.classList.remove('active'); });
  if(el) el.classList.add('active');
}

function gap(pageId, el){
  document.querySelectorAll('.page').forEach(function(page){ page.classList.remove('active'); });
  var page = document.getElementById(pageId);
  if(page) page.classList.add('active');
  document.querySelectorAll('.sb-item').forEach(function(item){ item.classList.remove('active'); });
  if(el) el.classList.add('active');
}

function fmt(value){
  var num = Number(value);
  if(isNaN(num)) return '$0';
  return num.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
}

function setText(id, value){
  var el = document.getElementById(id);
  if(el) el.textContent = value == null ? '' : value;
}

function setVal(id, value){
  var el = document.getElementById(id);
  if(el) el.value = value == null ? '' : value;
}

function saveData(){
  saveUsers();
  saveProducts();
}

function doLogout(){
  CU = null;
  PRODUCTS = {};
  saveSession(null);
  if(window.location.pathname.split('/').pop() === 'app_admin.html'){
    window.location.href = 'login.html';
  } else {
    window.location.href = 'login.html';
  }
}

function initApp(){
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initStorage);
  } else {
    initStorage();
  }
}

initApp();
