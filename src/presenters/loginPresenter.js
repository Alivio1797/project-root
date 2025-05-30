export default class LoginPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  init() {
    this.view.render();
    this.view.bindPresenter(this);
  }

 async onSubmit({ email, password }) {
    if (!email || !password) {
      this.view.showError('Email dan Password wajib diisi.');
      return;
    }

    try {
      await this.model.login(email, password);
      this.view.navigateTo('/home');

      // Broadcast event user login
      window.dispatchEvent(new Event('user-login'));
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}