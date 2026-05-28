// ══════════════════════════════════════════════════════════
// MÓDULO DE ASISTENCIA - FRONTEND SOLO LOCALSTORAGE
// ══════════════════════════════════════════════════════════

var attendanceTimerId = null;

function attendanceStorageKey(userId){
  return 'stockeasy_attendance_' + userId;
}

function loadAttendanceRecords(userId){
  try {
    var data = localStorage.getItem(attendanceStorageKey(userId));
    return data ? JSON.parse(data) : [];
  } catch(e){
    console.error('Error leyendo asistencia:', e);
    return [];
  }
}

function saveAttendanceRecords(userId, records){
  try {
    localStorage.setItem(attendanceStorageKey(userId), JSON.stringify(records));
  } catch(e){
    console.error('Error guardando asistencia:', e);
  }
}

function formatTwoDigits(value){
  return (value < 10 ? '0' : '') + value;
}

function getCurrentDate(){
  return new Date().toISOString().split('T')[0];
}

function getCurrentTime(){
  var now = new Date();
  return formatTwoDigits(now.getHours()) + ':' + formatTwoDigits(now.getMinutes()) + ':' + formatTwoDigits(now.getSeconds());
}

function getCurrentTimeShort(){
  var now = new Date();
  return formatTwoDigits(now.getHours()) + ':' + formatTwoDigits(now.getMinutes());
}

function getTodayAttendance(records){
  var today = getCurrentDate();
  return records.find(function(rec){ return rec.date === today; }) || null;
}

function getAttendanceStatus(record){
  if(!record) return 'Sin registro';
  if(record.entry && !record.exit) return 'Entrada registrada';
  if(record.entry && record.exit) return 'Salida registrada';
  return 'Sin registro';
}

function calculateHours(entry, exit){
  if(!entry || !exit) return '0h 0m';
  var partsEntry = entry.split(':');
  var partsExit = exit.split(':');
  if(partsEntry.length < 2 || partsExit.length < 2) return '0h 0m';
  var entryDate = new Date();
  entryDate.setHours(parseInt(partsEntry[0], 10), parseInt(partsEntry[1], 10), 0, 0);
  var exitDate = new Date();
  exitDate.setHours(parseInt(partsExit[0], 10), parseInt(partsExit[1], 10), 0, 0);
  var diff = exitDate - entryDate;
  if(diff < 0) return '0h 0m';
  var minutes = Math.floor(diff / 60000);
  return Math.floor(minutes / 60) + 'h ' + (minutes % 60) + 'm';
}

function updateAttendanceClock(){
  var el = document.getElementById('attendance-clock');
  if(el) el.textContent = getCurrentTime();
}

function renderAttendance(){
  if(!CU) return;
  var records = loadAttendanceRecords(CU.id);
  var today = getTodayAttendance(records);
  var entryTime = today && today.entry ? today.entry : '--:--';
  var exitTime = today && today.exit ? today.exit : '--:--';
  var status = getAttendanceStatus(today);
  var hours = today && today.entry && today.exit ? calculateHours(today.entry, today.exit) : '0h 0m';

  setText('att-status', status);
  setText('att-entry-time', entryTime);
  setText('att-exit-time', exitTime);
  setText('att-hours', hours);

  var btnEntry = document.getElementById('att-btn-entry');
  var btnExit = document.getElementById('att-btn-exit');
  var msg = document.getElementById('att-message');

  if(today && today.entry && !today.exit){
    if(btnEntry) btnEntry.style.display = 'none';
    if(btnExit) btnExit.style.display = 'inline-flex';
    if(msg) msg.textContent = 'Ya registraste entrada hoy. Marca tu salida cuando termines.';
  } else if(today && today.entry && today.exit){
    if(btnEntry) btnEntry.style.display = 'none';
    if(btnExit) btnExit.style.display = 'none';
    if(msg) msg.textContent = 'La asistencia de hoy ya está completa. No es posible registrar más.';
  } else {
    if(btnEntry) btnEntry.style.display = 'inline-flex';
    if(btnExit) btnExit.style.display = 'none';
    if(msg) msg.textContent = 'Carga tu asistencia cuando llegues al trabajo.';
  }

  renderAttendanceHistory(records);
}

function renderAttendanceHistory(records){
  var tbody = document.getElementById('att-history-body');
  if(!tbody) return;
  if(!records.length){
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;color:var(--muted)">No hay registros de asistencia aún.</td></tr>';
    return;
  }

  tbody.innerHTML = records.map(function(rec){
    return '<tr>' +
      '<td>' + rec.date + '</td>' +
      '<td>' + (rec.entry || '--:--') + '</td>' +
      '<td>' + (rec.exit || '--:--') + '</td>' +
      '<td>' + getAttendanceStatus(rec) + '</td>' +
      '</tr>';
  }).join('');
}

function registerAttendanceEntry(){
  if(!CU) return;
  var records = loadAttendanceRecords(CU.id);
  var today = getTodayAttendance(records);
  if(today && today.entry){
    toast('Ya has registrado la entrada de hoy.', 'error');
    renderAttendance();
    return;
  }

  var currentDate = getCurrentDate();
  var newRecord = {date: currentDate, entry: getCurrentTimeShort(), exit: '', userName: CU.name, status: 'Entrada registrada'};
  records.push(newRecord);
  saveAttendanceRecords(CU.id, records);
  toast('Entrada registrada correctamente.', 'success');
  renderAttendance();
}

function registerAttendanceExit(){
  if(!CU) return;
  var records = loadAttendanceRecords(CU.id);
  var today = getTodayAttendance(records);
  if(!today || !today.entry){
    toast('No hay entrada registrada para hoy.', 'error');
    return;
  }
  if(today.exit){
    toast('La salida de hoy ya fue registrada.', 'error');
    return;
  }

  today.exit = getCurrentTimeShort();
  today.status = 'Salida registrada';
  saveAttendanceRecords(CU.id, records);
  toast('Salida registrada correctamente.', 'success');
  renderAttendance();
}

function initAttendance(){
  updateAttendanceClock();
  renderAttendance();

  if(attendanceTimerId){
    clearInterval(attendanceTimerId);
  }
  attendanceTimerId = setInterval(updateAttendanceClock, 1000);
}

document.addEventListener('DOMContentLoaded', initAttendance);
