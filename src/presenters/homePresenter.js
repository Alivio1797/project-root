export default class HomePresenter {
  constructor(view) {
    this.view = view;
  }

  init() {
    this.view.render();
  }

  cleanup() {
    this.view.cleanup();
  }
}