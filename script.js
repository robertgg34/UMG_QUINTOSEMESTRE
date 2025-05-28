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

// Consulta de clima
function obtenerClima() {
  const ciudad = document.getElementById("ciudadInput").value;
  const resultados = document.getElementById("resultados");
  resultados.innerHTML = "<div class='text-muted'>Cargando...</div>";

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`)
    .then(res => res.json())
    .then(data => {
      const temp = data.main.temp;
      const descripcion = data.weather[0].description;
      const bebida = recomendarBebida(temp);

      resultados.innerHTML = `
        <div class="col-md-6">
          <div class="card p-4">
            <h2 class="card-title">🌡️ ${temp}°C en ${ciudad}</h2>
            <p class="card-text">Descripción: ${descripcion}</p>
            <p class="card-text">🥤 Recomendación: <strong>${bebida}</strong></p>
          </div>
        </div>
      `;
    })
    .catch(() => {
      resultados.innerHTML = "<div class='text-danger'>❌ No se pudo obtener el clima.</div>";
    });
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
