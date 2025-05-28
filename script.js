const API_KEY = "2afb928f1ab573a6ffda0ac21ec7b16a";

// Login
const formLogin = document.getElementById("form-login");
if (formLogin) {
  formLogin.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;

    fetch("https://clima-backend-fwfz.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          window.location.href = "clima.html";
        } else {
          alert("Credenciales incorrectas");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Error de conexión al servidor");
      });
  });
}

// Consulta de clima: hoy + próximos 5 días
function obtenerClima() {
  const ciudad = document.getElementById("ciudadInput").value;
  const resultados = document.getElementById("resultados");
  resultados.innerHTML = "<div class='text-muted'>Cargando...</div>";

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`)
    .then(res => res.json())
    .then(data => {
      const diasAgrupados = agruparPronostico(data.list);
      mostrarClimaConBebida(diasAgrupados, resultados);
    })
    .catch(() => {
      resultados.innerHTML = "<div class='text-danger'>❌ No se pudo obtener el clima.</div>";
    });
}

function agruparPronostico(lista) {
  const dias = {};
  lista.forEach(item => {
    const fecha = item.dt_txt.split(" ")[0];
    if (!dias[fecha]) dias[fecha] = [];
    dias[fecha].push(item);
  });

  const resumen = [];

  Object.keys(dias).slice(0, 6).forEach(fecha => {
    const dia = dias[fecha];
    const temps = dia.map(d => d.main.temp);
    const promedio = temps.reduce((a, b) => a + b, 0) / temps.length;
    const descripcion = dia[0].weather[0].description;

    resumen.push({
      fecha,
      temp: promedio.toFixed(1),
      descripcion,
      bebida: recomendarBebida(promedio)
    });
  });

  return resumen;
}

function mostrarClimaConBebida(dias, contenedor) {
  contenedor.innerHTML = dias.map(dia => {
    const fechaFormateada = new Date(dia.fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "short"
    });

    return `
      <div class="card p-3 my-2">
        <h4>${fechaFormateada}</h4>
        <p>🌡️ ${dia.temp}°C – ${dia.descripcion}</p>
        <p>🥤 <strong>${dia.bebida}</strong></p>
      </div>
    `;
  }).join("");
}

function recomendarBebida(temp) {
  if (temp <= 10) return "Chocolate caliente o atolito";
  if (temp > 10 && temp <= 20) return "Té caliente o café";
  if (temp > 20 && temp <= 28) return "Limonada o smoothie";
  return "Agua con hielo o agua de coco";
}

function cerrarSesion() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
