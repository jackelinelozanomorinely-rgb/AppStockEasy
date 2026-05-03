function show(id) {
  document.getElementById(id).style.display = 'block';
}

function showTab(id) {
    document.querySelectorAll('.stories-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + id).classList.add('active');
    event.target.classList.add('active');
  }