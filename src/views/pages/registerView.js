import RegisterPresenter from '../../presenters/registerPresenter.js';

export default class RegisterView {
  constructor(model) {
    this.app = document.getElementById('app');
    this.presenter = new RegisterPresenter(this, model);
  }

  init() {
    this.render();
    this.bindPresenter();
    this.presenter.init();
  }

  render() {
    this.app.innerHTML = `
      <form id="register-form">
        <h2>Register</h2>

        <label for="name">Name:</label>
        <input type="text" id="name" placeholder="Name" required />

        <label for="email">Email:</label>
        <input type="email" id="email" placeholder="Email" required />

        <label for="password">Password:</label>
        <input type="password" id="password" placeholder="Password" required minlength="6" />

        <button type="submit">Register</button>
      </form>
    `;
  }


  bindPresenter() {
    const form = this.app.querySelector('#register-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.querySelector('#name').value;
      const email = form.querySelector('#email').value;
      const password = form.querySelector('#password').value;
      this.presenter.onSubmit({ name, email, password });
    });
  }

  showError(message) {
    alert(`Register gagal: ${message}`);
  }

  navigateTo(path) {
    window.location.hash = path;
  }
}