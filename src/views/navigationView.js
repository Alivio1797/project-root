import NavigationPresenter from '../presenters/navigationPresenter';

export default class NavigationView {
  constructor(model) {
    this.navContainer = document.getElementById('nav') || this._initNavContainer();
    this.presenter = new NavigationPresenter(this, model);
  }

  _initNavContainer() {
    const nav = document.createElement('nav');
    nav.id = 'nav';
    const appElement = document.getElementById('app');
    if (appElement && appElement.parentNode) {
      appElement.parentNode.insertBefore(nav, appElement);
    } else {
      document.body.appendChild(nav);
    }
    return nav;
  }

  init() {
    this.presenter.init().then(() => {
      this.updateNav();
    });
  }

  render() {
    const isLoggedIn = this.presenter.model.isAuthenticated();
    const subText = this.presenter.isSubscribed ? 'Unsubscribe' : 'Subscribe';

    this.navContainer.innerHTML = `
      <ul style="display:flex; gap:1rem; list-style:none;">
        <li><a href="#/home">Home</a></li>
        <li><a href="#/stories">Stories</a></li>
        <li><a href="#/saved">Saved Stories</a></li>
        ${isLoggedIn
          ? `
            <li><a href="#/add">Add Story</a></li>
            <li><button id="subscribe-button">${subText}</button></li>
            <li><button id="auth-button">Logout</button></li>
          `
          : `<li><button id="auth-button">Login/Register</button></li>`}
      </ul>
    `;
  }

  bindPresenter() {
    // Remove previous listeners by cloning nodes
    const authBtn = document.getElementById('auth-button');
    const subBtn = document.getElementById('subscribe-button');
    if (authBtn) authBtn.replaceWith(authBtn.cloneNode(true));
    if (subBtn) subBtn.replaceWith(subBtn.cloneNode(true));

    const newAuthBtn = document.getElementById('auth-button');
    const newSubBtn = document.getElementById('subscribe-button');

    if (this.presenter.model.isAuthenticated()) {
      newAuthBtn.addEventListener('click', () => this.presenter.onLogout());
      if (newSubBtn) {
        newSubBtn.addEventListener('click', () => {
          if (this.presenter.isSubscribed) {
            this.presenter.onUnsubscribe();
          } else {
            this.presenter.onSubscribe();
          }
        });
      }
    } else if (newAuthBtn) {
      newAuthBtn.addEventListener('click', () => {
        window.location.hash = '#/login';
      });
    }
  }

  updateNav() {
    this.render();
    this.bindPresenter();
  }
}