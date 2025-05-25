const API_KEY = "2afb928f1ab573a6ffda0ac21ec7b16a"; // API KEY

function obtenerClima() {
  const ciudad = document.getElementById("ciudadInput").value;
  const resultados = document.getElementById("resultados");
  resultados.innerHTML = "Cargando...";

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`)
    .then(res => res.json())
    .then(data => {
      const dias = filtrarPorDia(data.list);
      mostrarResultados(dias);
    })
    .catch(err => {
      resultados.innerHTML = `<div class="alert alert-danger">Error al obtener datos. Verifica la ciudad.</div>`;
    });
}

function filtrarPorDia(lista) {
  const dias = {};
  lista.forEach(item => {
    const fecha = item.dt_txt.split(" ")[0];
    if (!dias[fecha]) dias[fecha] = item.main.temp;
  });
  return dias;
}

function recomendarBebida(temp) {
  if (temp <= 5) return "🍫 Chocolate caliente";
  if (temp <= 10) return "🌿 Infusión de menta";
  if (temp <= 18) return "☕ Café o té";
  if (temp <= 25) return "🥤 Refresco con hielo";
  return "🍹 Smoothie o bebida fría";
}

function mostrarResultados(dias) {
  const resultados = document.getElementById("resultados");
  resultados.innerHTML = "";

  Object.entries(dias).forEach(([fecha, temp]) => {
    const bebida = recomendarBebida(temp);
    resultados.innerHTML += `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${fecha}</h5>
          <p class="card-text">🌡️ Temperatura: ${temp.toFixed(1)} °C</p>
          <p class="card-text">🍹 Recomendación: <strong>${bebida}</strong></p>
        </div>
      </div>
    `;
  });
}
