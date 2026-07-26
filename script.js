// =========================================================
// COMPUTER CENTER — lógica de cálculo del formulario
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

  var form = document.getElementById('build-form');
  var warning = document.getElementById('form-warning');
  var summaryList = document.getElementById('summary-list');
  var ledTotal = document.getElementById('led-total');
  var resetBtn = document.getElementById('reset-btn');

  var selectIds = ['gabinete', 'procesador', 'disco', 'ram', 'monitor'];

  function money(n) {
    return '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function labelFor(id) {
    var map = {
      gabinete: 'Gabinete',
      procesador: 'Procesador',
      disco: 'Disco Duro',
      ram: 'Memoria RAM',
      monitor: 'Monitor'
    };
    return map[id] || id;
  }

  function readSelection() {
    var items = [];
    var total = 0;
    var missing = false;
    var i;

    for (i = 0; i < selectIds.length; i++) {
      var id = selectIds[i];
      var select = document.getElementById(id);
      var option = select.options[select.selectedIndex];

      if (!select.value) {
        missing = true;
        continue;
      }

      var price = Number(option.getAttribute('data-price') || 0);
      total += price;
      items.push({ label: labelFor(id) + ': ' + select.value, price: price });
    }

    var checked = form.querySelectorAll('input[name="accesorio"]:checked');
    for (i = 0; i < checked.length; i++) {
      var box = checked[i];
      var accPrice = Number(box.getAttribute('data-price') || 0);
      total += accPrice;
      items.push({ label: 'Accesorio: ' + box.value, price: accPrice });
    }

    return { items: items, total: total, missing: missing };
  }

  function renderSummary(items, total) {
    summaryList.innerHTML = '';

    if (items.length === 0) {
      var emptyLi = document.createElement('li');
      emptyLi.className = 'summary-empty';
      emptyLi.textContent = 'Aún no has seleccionado componentes.';
      summaryList.appendChild(emptyLi);
    } else {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var li = document.createElement('li');

        var labelSpan = document.createElement('span');
        labelSpan.textContent = item.label;

        var priceSpan = document.createElement('span');
        priceSpan.className = 'item-price';
        priceSpan.textContent = money(item.price);

        li.appendChild(labelSpan);
        li.appendChild(priceSpan);
        summaryList.appendChild(li);
      }
    }

    ledTotal.textContent = money(total);
    ledTotal.classList.remove('pulse');
    void ledTotal.offsetWidth;
    ledTotal.classList.add('pulse');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var result = readSelection();

    if (result.missing) {
      warning.textContent = 'Selecciona una opción en cada sección (Gabinete, Procesador, Disco Duro, RAM y Monitor) antes de calcular.';
    } else {
      warning.textContent = '';
    }

    renderSummary(result.items, result.total);
  });

  resetBtn.addEventListener('click', function () {
    warning.textContent = '';
    setTimeout(function () {
      renderSummary([], 0);
    }, 0);
  });
});
