(function () {
  var root = document.documentElement, KEY = 'dd-theme';
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    document.getElementById('themeBtn').textContent = t === 'dark' ? 'Tema claro' : 'Tema escuro';
    try { localStorage.setItem(KEY, t); } catch (e) {}
  }
  var saved = null; try { saved = localStorage.getItem(KEY); } catch (e) {}
  setTheme(saved || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  document.getElementById('themeBtn').onclick = function () { setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); };

  var sb = document.getElementById('sidebar');
  document.getElementById('menuBtn').onclick = function () { sb.classList.toggle('open'); };
  sb.addEventListener('click', function (e) { if (e.target.tagName === 'A') sb.classList.remove('open'); });

  var input = document.getElementById('search'), secs = [].slice.call(document.querySelectorAll('section.tbl'));
  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function filter() {
    var q = norm(input.value.trim()), shown = 0;
    secs.forEach(function (s) {
      var name = norm(s.dataset.name), tHit = !q || name.indexOf(q) > -1, rowHit = 0;
      [].forEach.call(s.querySelectorAll('tbody tr'), function (r) {
        var col = norm(r.cells[0].textContent), ok = tHit || col.indexOf(q) > -1;
        r.classList.toggle('off', !ok); if (ok) rowHit++;
      });
      var vis = rowHit > 0; s.hidden = !vis; if (vis) shown++;
      var li = sb.querySelector('a[data-t="' + s.dataset.name + '"]').parentNode; li.classList.toggle('off', !vis);
    });
    document.getElementById('count').textContent = shown + ' de ' + secs.length + ' tabelas exibidas';
    document.getElementById('empty').hidden = shown > 0;
  }
  input.addEventListener('input', filter); filter();

  var modal = document.getElementById('modal'), stage = document.getElementById('stage'), pz = null;
  function openDer() {
    modal.hidden = false; document.body.style.overflow = 'hidden';
    if (!pz && window.Panzoom) {
      pz = Panzoom(document.getElementById('derImg'), { maxScale: 10, minScale: 0.3, contain: false, cursor: 'grab' });
      stage.addEventListener('wheel', pz.zoomWithWheel);
    }
    if (pz) pz.reset({ animate: false });
  }
  function closeDer() { modal.hidden = true; document.body.style.overflow = ''; }
  document.getElementById('openDer').onclick = openDer;
  document.getElementById('closeDer').onclick = closeDer;
  document.getElementById('zin').onclick = function () { if (pz) pz.zoomIn(); };
  document.getElementById('zout').onclick = function () { if (pz) pz.zoomOut(); };
  document.getElementById('zreset').onclick = function () { if (pz) pz.reset(); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeDer(); });
})();
