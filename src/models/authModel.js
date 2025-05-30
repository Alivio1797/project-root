// src/models/authModel.js
export default class AuthModel {
  constructor() {
    this.api = 'https://story-api.dicoding.dev/v1';
  }

  async login(email, password) {
    const res  = await fetch(`${this.api}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    localStorage.setItem('authToken', data.loginResult.token);
  }

  async register(name, email, password) {
    const res  = await fetch(`${this.api}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
  }

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  logout() {
    localStorage.removeItem('authToken');
  }
}