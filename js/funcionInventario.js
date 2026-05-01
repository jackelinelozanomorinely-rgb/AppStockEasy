// funcionInventario.js

var DEMO_PRODUCTS = {
  'Camiseta Roja':{desc:'Talla M, algodon 100%, color rojo',qty:25,price:15000,min:10},
  'Zapatos Deportivos':{desc:'Talla 42, marca deportiva',qty:3,price:90000,min:10},
  'Boligrafo Azul':{desc:'Punta fina 0.5mm',qty:50,price:2000,min:20},
  'Taza Blanca':{desc:'Ceramica 350ml',qty:12,price:18000,min:5}
};

var PRODUCTS = {};

function loadUserProducts(userId){
  var key = 'stockeasy_products_' + userId;
  var saved = localStorage.getItem(key);

  if(saved){
    PRODUCTS = JSON.parse(saved);
  } else {
    PRODUCTS = {};
  }
}

function saveProducts(){
  if(!CU) return;
  localStorage.setItem('stockeasy_products_' + CU.id, JSON.stringify(PRODUCTS));
}

function renderProds(){
  var names = Object.keys(PRODUCTS);
}

function openProdModal(){}

function openEditProd(name){}

function saveProd(){}

function pedirEliminar(name){}

function confirmarEliminar(){}

function openDetail(name){}

function registrarEntrada(){}

function registrarSalida(){}

function addHistRow(prod,tipo,qty,date,nota){}