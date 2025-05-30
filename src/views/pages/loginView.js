import LoginPresenter from '../../presenters/loginPresenter.js';

export default class LoginView {
  constructor(model) {
    this.app = document.getElementById('app');
    this.presenter = new LoginPresenter(this, model);
  }

  init() {
    this.render();
    this.bindPresenter();
    this.presenter.init();
  }

  render() {
    this.app.innerHTML = `
      <form id="login-form">
        <h2>Login</h2>

        <label for="email">Email:</label>
        <input type="email" id="email" placeholder="Email" required />

        <label for="password">Password:</label>
        <input type="password" id="password" placeholder="Password" required />

        <button type="submit">Login</button>
      </form>
      <p>Belum punya akun? <a href="#/register" id="register-link">Daftar di sini</a></p>

    `;
  }

  bindPresenter() {
    const form = this.app.querySelector('#login-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = form.querySelector('#email').value;
      const password = form.querySelector('#password').value;
      this.presenter.onSubmit({ email, password });
    });
  }

  showError(message) {
    alert(`Login gagal: ${message}`);
  }

  navigateTo(path) {
    window.location.hash = path;
  }
}