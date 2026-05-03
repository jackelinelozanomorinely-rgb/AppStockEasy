// ======== INICIALIZACIÓN DEL DASHBOARD ========

/**
 * Esta función se encarga de llenar todos los datos del usuario 
 * y las estadísticas apenas carga la página.
 */
function initDashboard() {
    if (!CU) {
        location.href = 'login.html';
        return;
    }

    if(typeof loadUser === 'function') loadUser();
    if(typeof renderProds === 'function') renderProds();
    if(typeof updateDashStats === 'function') updateDashStats();
    if(typeof renderAlerts === 'function') renderAlerts();
}

/**
 * Carga los datos del usuario actual (CU) en los elementos del HTML.
 */
function loadUser() {
    if (!CU) return;

    // Generamos las iniciales para el avatar (Ej: Maria Cardona -> MC)
    var ini = CU.name.split(' ')
                .map(function(w) { return w[0]; })
                .join('')
                .substring(0, 2)
                .toUpperCase();

    // Llenamos los elementos del Sidebar y Profile
    var avEl = document.getElementById('sb-av');
    if (avEl) avEl.textContent = ini;

    setText('sb-nm', CU.name); // Nombre del usuario
    setText('sb-bz', CU.biz);  // Nombre de la empresa (Business)
}

/**
 * Función para cerrar sesión y limpiar los datos temporales.
 */
function doLogout() {
    CU = null;
    PRODUCTS = {};
    saveSession(null); // Limpiamos el localStorage
    window.location.href = 'login.html';
}

// ======== LÓGICA DE ESTADÍSTICAS Y TABLA ========

/**
 * Sobrescribimos o extendemos renderProds para que también 
 * actualice los números de las tarjetas superiores del Dashboard.
 */
function updateDashStats() {
    var names = Object.keys(PRODUCTS);
    var lowStockCount = 0;

    // Contamos cuántos productos están por debajo del mínimo configurado
    names.forEach(function(name) {
        if (PRODUCTS[name].qty <= PRODUCTS[name].min) {
            lowStockCount++;
        }
    });

    // Actualizamos los números grandes en las tarjetas del HTML
    setText('dash-total', names.length);
    setText('dash-low', lowStockCount);
    
    // Cambiamos el color del contador de stock bajo si hay urgencias
    var lowEl = document.getElementById('dash-low');
    if (lowEl) {
        lowEl.style.color = lowStockCount > 0 ? 'var(--red)' : 'var(--g1)';
    }
}

// Ejecutar la inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initDashboard);