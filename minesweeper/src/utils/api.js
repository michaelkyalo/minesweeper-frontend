const API_BASE = "http://127.0.0.1:5000";  // Flask backend URL

export async function loginUser(username, password) {
  const resp = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await resp.json();
  if (!resp.ok) throw new Error(data.msg || "Login failed");

  return data; // { access_token }
}

export async function registerUser(username, password) {
  const resp = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await resp.json();
  if (!resp.ok) throw new Error(data.msg || "Register failed");

  return data;
}

export async function getGameState() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const resp = await fetch(`${API_BASE}/game/state`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await resp.json();
  if (!resp.ok) throw new Error(data.msg || "Failed to fetch game state");

  return data;
}
