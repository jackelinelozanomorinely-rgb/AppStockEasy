var DEMO_PRODUCTS = {
  'Camiseta Roja':{desc:'Talla M, algodon 100%, color rojo',qty:25,price:15000,min:10,
    hist:[{t:'Entrada',q:10,d:'2026-04-12',n:'Compra proveedor'},{t:'Salida',q:3,d:'2026-04-08',n:'Venta'},
          {t:'Entrada',q:28,d:'2026-03-20',n:'Stock inicial'},{t:'Salida',q:10,d:'2026-03-25',n:'Venta'}]},
  'Zapatos Deportivos':{desc:'Talla 42, marca deportiva',qty:3,price:90000,min:10,
    hist:[{t:'Entrada',q:15,d:'2026-03-10',n:'Compra'},{t:'Salida',q:12,d:'2026-03-28',n:'Venta'},
          {t:'Salida',q:5,d:'2026-04-11',n:'Venta'}]},
  'Boligrafo Azul':{desc:'Punta fina 0.5mm',qty:50,price:2000,min:20,
    hist:[{t:'Entrada',q:50,d:'2026-02-01',n:'Stock inicial'},{t:'Salida',q:10,d:'2026-03-15',n:'Venta'},
          {t:'Entrada',q:20,d:'2026-04-10',n:'Compra'},{t:'Salida',q:10,d:'2026-04-14',n:'Venta'}]},
  'Taza Blanca':{desc:'Ceramica 350ml',qty:12,price:18000,min:5,
    hist:[{t:'Entrada',q:17,d:'2026-01-15',n:'Stock inicial'},{t:'Salida',q:5,d:'2026-04-09',n:'Venta'}]}
};

var DEFAULT_USERS = [
  {id:1, email:'demo@stockeasy.com', pass:'1234', name:'Maria Cardona', biz:'Tienda La Esperanza', tel:'3001234567', active:true}
];
