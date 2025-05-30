export default class RegisterPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  init() {
    // Jika ada logic inisialisasi, bisa ditambahkan
  }

  async onSubmit({ name, email, password }) {
    if (!name || !email || !password) {
      this.view.showError('Semua field wajib diisi.');
      return;
    }
    if (password.length < 6) {
      this.view.showError('Password minimal 6 karakter.');
      return;
    }

    try {
      await this.model.register(name, email, password);
      this.view.navigateTo('/login');
    } catch (err) {
      this.view.showError(err.message);
    }
  }
}