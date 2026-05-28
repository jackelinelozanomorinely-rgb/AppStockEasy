// ════════════════════════════════════════════════════════
// DASHBOARD.JS — StockEasy
// Lee PRODUCTS desde localStorage via las funciones de
// main.js (initStorage / loadUserProducts / saveProducts)
// ════════════════════════════════════════════════════════

var MONTH_NAMES = ['Ene','Feb','Mar','Abr','May','Jun',
                   'Jul','Ago','Sep','Oct','Nov','Dic'];

// ────────────────────────────────────────────────────────
// ARRANQUE
// main.js llama initStorage() con initApp() de forma
// síncrona al cargar el script, antes de DOMContentLoaded.
// Por eso esperamos DOMContentLoaded para pintar, pero
// los datos ya están en PRODUCTS y CU cuando llegamos aquí.
// ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {

    // Si la sesión no está activa, redirigir
    if (!CU) {
        window.location.href = 'login.html';
        return;
    }

    // Refrescar productos desde localStorage por si venimos
    // de otra página que guardó cambios
    loadUserProducts(CU.id);

    // Pintar sidebar
    renderSidebarUser();

    // Pintar todos los widgets
    refreshDashboard();
});

// Escuchar cambios de otra pestaña (inventory, products)
window.addEventListener('storage', function (e) {
    if (!CU) return;
    if (e.key === 'stockeasy_products_' + CU.id) {
        try { PRODUCTS = JSON.parse(e.newValue) || {}; }
        catch (_) { PRODUCTS = {}; }
        refreshDashboard();
    }
});


// ════════════════════════════════════════════════════════
// REFRESH COMPLETO
// ════════════════════════════════════════════════════════
function refreshDashboard() {
    updateDashStats();
    renderDashboardAlerts();
    renderDashboardMovements();
    renderMonthlyChart();
}


// ════════════════════════════════════════════════════════
// SIDEBAR — usuario actual
// ════════════════════════════════════════════════════════
function renderSidebarUser() {
    if (!CU) return;

    var ini = CU.name
        .split(' ')
        .map(function (w) { return w[0] || ''; })
        .join('')
        .substring(0, 2)
        .toUpperCase();

    setText('sb-av', ini);
    setText('sb-nm', CU.name);
    setText('sb-bz', CU.biz);
}


// ════════════════════════════════════════════════════════
// TARJETAS NUMÉRICAS (stats)
// ════════════════════════════════════════════════════════
function updateDashStats() {

    var names    = Object.keys(PRODUCTS);
    var now      = new Date();
    var curMonth = now.getMonth();
    var curYear  = now.getFullYear();

    var lowCount      = 0;
    var totalEntradas = 0;
    var totalSalidas  = 0;

    names.forEach(function (name) {
        var prod = PRODUCTS[name];

        if (prod.qty <= prod.min) lowCount++;

        if (prod.hist && Array.isArray(prod.hist)) {
            prod.hist.forEach(function (mov) {
                var d = dbParseDate(mov.d);
                if (!d) return;
                if (d.getMonth() !== curMonth || d.getFullYear() !== curYear) return;
                var q = Number(mov.q) || 0;
                if (mov.t === 'Entrada') totalEntradas += q;
                if (mov.t === 'Salida')  totalSalidas  += q;
            });
        }
    });

    setText('dash-total', names.length);
    setText('dash-low',   lowCount);
    setText('dash-in',    '+' + totalEntradas);
    setText('dash-out',   '-' + totalSalidas);

    // Colores dinámicos usando variables CSS del proyecto
    var lowEl = document.getElementById('dash-low');
    if (lowEl) lowEl.style.color = lowCount > 0 ? 'var(--red)' : 'var(--g1)';

    var outEl = document.getElementById('dash-out');
    if (outEl) outEl.style.color = totalSalidas > 0 ? 'var(--red)' : 'var(--b1)';

    // Badge alertas sidebar
    var badgeEl = document.getElementById('alert-badge');
    if (badgeEl) {
        badgeEl.textContent    = lowCount || '';
        badgeEl.style.display  = lowCount ? '' : 'none';
    }
}


// ════════════════════════════════════════════════════════
// ALERTAS RECIENTES
// ════════════════════════════════════════════════════════
function renderDashboardAlerts() {

    var cont = document.getElementById('dash-alerts');
    if (!cont) return;

    var lista = [];

    Object.keys(PRODUCTS).forEach(function (name) {
        var p = PRODUCTS[name];
        if (p.qty <= p.min) {
            lista.push({
                name    : name,
                qty     : p.qty,
                min     : p.min,
                urgente : p.qty === 0
            });
        }
    });

    // Urgentes primero
    lista.sort(function (a, b) {
        return (b.urgente ? 1 : 0) - (a.urgente ? 1 : 0);
    });

    var urgCount = lista.filter(function (a) { return a.urgente; }).length;

    // Badge en el card-head
    var badgeEl = document.getElementById('alerts-badge');
    if (badgeEl) {
        if (lista.length > 0) {
            badgeEl.style.display = 'inline-block';
            if (urgCount > 0) {
                badgeEl.textContent      = urgCount + ' URGENTES';
                badgeEl.style.background = '#fff1f2';
                badgeEl.style.color      = 'var(--red)';
            } else {
                badgeEl.textContent      = lista.length + ' BAJOS';
                badgeEl.style.background = '#fff7ed';
                badgeEl.style.color      = 'var(--amber)';
            }
        } else {
            badgeEl.style.display = 'none';
        }
    }

    if (lista.length === 0) {
        cont.innerHTML = '<div class="empty-hint">✅ Sin alertas actualmente</div>';
        return;
    }

    cont.innerHTML = lista.map(function (a) {
        var color = a.urgente
            ? 'background:#fff1f2;color:var(--red)'
            : 'background:#fff7ed;color:var(--amber)';
        var label = a.urgente ? 'URGENTE' : 'BAJO';
        return '<div class="alert-row">'
            + '<span class="badge" style="' + color + '">' + label + '</span>'
            + '<div>'
            +   '<div class="alert-name">' + dbEscH(a.name) + '</div>'
            +   '<div class="alert-sub">Solo ' + a.qty + ' en stock — mínimo ' + a.min + '</div>'
            + '</div>'
            + '</div>';
    }).join('');
}


// ════════════════════════════════════════════════════════
// MOVIMIENTOS RECIENTES
// ════════════════════════════════════════════════════════
function renderDashboardMovements() {

    var tbody = document.getElementById('dash-movements');
    if (!tbody) return;

    // Aplanar hist de todos los productos
    var all = [];

    Object.keys(PRODUCTS).forEach(function (name) {
        var prod = PRODUCTS[name];
        if (!prod.hist || !Array.isArray(prod.hist)) return;

        prod.hist.forEach(function (mov) {
            all.push({
                product : name,
                type    : mov.t,
                qty     : mov.q,
                date    : mov.d,
                hora    : mov.h || '',
                nota    : mov.n || '—'
            });
        });
    });

    // Más reciente primero
    all.sort(function (a, b) {
        var da = dbParseDate(a.date), db = dbParseDate(b.date);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        var diff = db - da;
        if (diff !== 0) return diff;
        return (b.hora || '') > (a.hora || '') ? 1 : -1;
    });

    var countEl = document.getElementById('dash-mov-count');
    if (countEl) countEl.textContent = all.length > 0 ? all.length + ' registros' : '';

    if (all.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-hint">No hay movimientos registrados aún</td></tr>';
        return;
    }

    tbody.innerHTML = all.map(function (mov) {
        var isIn   = mov.type === 'Entrada';
        var cls    = isIn ? 'b-grn' : 'b-red';
        var amtCls = isIn ? 'mov-in' : 'mov-out';
        var prefix = isIn ? '+' : '-';
        var fechaHtml = dbEscH(mov.date)
            + (mov.hora ? '<br><span style="font-size:11px;color:var(--muted)">' + dbEscH(mov.hora) + '</span>' : '');

        return '<tr>'
            + '<td style="font-weight:500">' + dbEscH(mov.product) + '</td>'
            + '<td><span class="badge ' + cls + '">' + dbEscH(mov.type) + '</span></td>'
            + '<td class="' + amtCls + '">' + prefix + mov.qty + '</td>'
            + '<td style="color:var(--muted);font-size:12px">' + dbEscH(mov.nota) + '</td>'
            + '<td style="color:var(--muted);font-size:12px">' + fechaHtml + '</td>'
            + '</tr>';
    }).join('');
}


// ════════════════════════════════════════════════════════
// GRÁFICA — últimos 6 meses
// ════════════════════════════════════════════════════════
function renderMonthlyChart() {

    var container = document.getElementById('dash-chart');
    if (!container) return;

    var now      = new Date();
    var curMonth = now.getMonth();
    var curYear  = now.getFullYear();

    // Armar los 6 meses
    var months = [];
    for (var i = 5; i >= 0; i--) {
        var d = new Date(curYear, curMonth - i, 1);
        months.push({
            label : MONTH_NAMES[d.getMonth()],
            month : d.getMonth(),
            year  : d.getFullYear(),
            total : 0,
            isCur : i === 0
        });
    }

    // Acumular movimientos por mes
    Object.keys(PRODUCTS).forEach(function (name) {
        var prod = PRODUCTS[name];
        if (!prod.hist || !Array.isArray(prod.hist)) return;

        prod.hist.forEach(function (mov) {
            var d = dbParseDate(mov.d);
            if (!d) return;
            months.forEach(function (m) {
                if (m.month === d.getMonth() && m.year === d.getFullYear()) {
                    m.total += Number(mov.q) || 0;
                }
            });
        });
    });

    var maxVal = Math.max.apply(null, months.map(function (m) { return m.total; }));
    if (maxVal === 0) maxVal = 1;

    var MAX_H = 82;

    container.innerHTML = months.map(function (m) {
        var pct  = m.total / maxVal;
        var barH = m.total > 0 ? Math.max(pct * MAX_H, 6) : 2;
        var cls  = m.isCur ? 'bar current' : (m.total === 0 ? 'bar empty' : 'bar');
        return '<div class="bar-col">'
            + '<div class="bar-val">' + (m.total > 0 ? m.total : '') + '</div>'
            + '<div class="' + cls + '" style="height:' + barH + 'px"'
            +      ' title="' + m.label + ': ' + m.total + ' uds"></div>'
            + '<div class="bar-lbl">' + m.label + '</div>'
            + '</div>';
    }).join('');

    var labelEl = document.getElementById('chart-label');
    if (labelEl) labelEl.textContent = MONTH_NAMES[curMonth] + ' ' + curYear;
}


// ════════════════════════════════════════════════════════
// HELPERS PRIVADOS (prefijo db_ para no chocar con otros)
// ════════════════════════════════════════════════════════

// Parsea YYYY-MM-DD o DD/MM/YYYY
function dbParseDate(str) {
    if (!str) return null;
    var m1 = String(str).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m1) return new Date(+m1[1], +m1[2] - 1, +m1[3]);
    var m2 = String(str).match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if (m2) return new Date(+m2[3], +m2[2] - 1, +m2[1]);
    return null;
}

// Escapa HTML para evitar XSS
function dbEscH(str) {
    return String(str == null ? '' : str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}


// ════════════════════════════════════════════════════════
// LOGOUT
// NOTA: doLogout() ya está definida en main.js.
// NO la redefinimos aquí para evitar conflicto.
// El botón "Salir" del HTML llama a doLogout() de main.js.
// ════════════════════════════════════════════════════════
