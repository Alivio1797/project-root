export default class HomeView {
  constructor() {
    this.app = document.getElementById('app');
  }

  init() {
    this.render();
  }

  render() {
    this.app.innerHTML = `
      <section id="home-section">
        <h1>Selamat Datang di Aplikasi Story Sharing!</h1>
        <p>Silakan eksplor cerita dari pengguna lain atau tambahkan ceritamu sendiri.</p>
      </section>
    `;
  }
}