const API = "http://localhost:3000/api";

async function fetchWithCred(url, opts = {}) {
  opts = opts || {};
  opts.credentials = 'include';
  opts.headers = opts.headers || {};
  return fetch(url, opts);
}

export async function logout() {
  try {
    await fetchWithCred(`${API}/logout`, { method: 'POST' });
  } catch (e) {
    console.error('logout error', e);
  }
  window.location.href = '/index.html';
}

/* REGISTER */
const regForm = document.getElementById('regForm');
if (regForm) {
  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const role = document.getElementById('regRole').value;
    const adminSecret = document.getElementById('adminSecret')?.value.trim() || '';
    const regMsg = document.getElementById('regMsg');

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      regMsg.style.color = 'red';
      regMsg.textContent = 'Correo inválido';
      return;
    }

    // Validar contraseña
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPassword.test(password)) {
      regMsg.style.color = 'red';
      regMsg.textContent = 'Contraseña débil: 8+ caracteres, mayúscula, minúscula, número y símbolo';
      return;
    }

    try {
      const body = { email, password, role };
      if (role === 'admin') body.adminSecret = adminSecret;

      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        regMsg.style.color = 'red';
        regMsg.textContent = data.error || res.statusText;
        return;
      }

      regMsg.style.color = 'green';
      regMsg.textContent = 'Cuenta creada correctamente. Ve a login.';
      regForm.reset();
    } catch (err) {
      regMsg.style.color = 'red';
      regMsg.textContent = 'Error de red: ' + err.message;
    }
  });
}

/* LOGIN */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const msg = document.getElementById('msg');

    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        msg.textContent = data.error || res.statusText;
        return;
      }

      const profileRes = await fetch(`${API}/profile`, { credentials: 'include' });
      if (!profileRes.ok) {
        msg.textContent = 'No autorizado';
        return;
      }
      const profile = await profileRes.json();

      if (profile.role === 'estudiante') window.location.href = '/estudiante.html';
      else if (profile.role === 'maestro') window.location.href = '/maestro.html';
      else window.location.href = '/admin.html';

    } catch (err) {
      msg.textContent = 'Error de red: ' + err.message;
    }
  });
}
