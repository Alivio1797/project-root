import AuthModel from './models/authModel.js';
import StoryModel from './models/storyModel.js';

import NavigationView from './views/navigationView.js';
import HomeView from './views/pages/homeView.js';
import StoriesView from './views/pages/storiesView.js';
import StoriesPresenter from './presenters/storiesPresenter.js';
import AddStoryView from './views/pages/addStoryView.js';
import AddStoryPresenter from './presenters/addStoryPresenter.js';
import LoginView from './views/pages/loginView.js';
import RegisterView from './views/pages/registerView.js';
import SavedStoriesView from './views/pages/savedStoriesView.js';
import SavedStoriesPresenter from './presenters/savedStoriesPresenter.js';

export default function App() {
  const authModel = new AuthModel();
  const storyModel = new StoryModel();

  const navView = new NavigationView(authModel);
  navView.init();

  // Event update nav
  window.addEventListener('user-login', () => navView.updateNav());
  window.addEventListener('user-logout', () => navView.updateNav());

  let currentView = null;
  let currentPresenter = null;

  function cleanupCurrent() {
    if (currentPresenter && currentPresenter.cleanup) {
      currentPresenter.cleanup();
    }
    if (currentView && currentView.cleanup) {
      currentView.cleanup();
    }
    currentView = null;
    currentPresenter = null;
  }

  function router() {
    cleanupCurrent();

    const hash = window.location.hash || '#/home';

    switch (hash) {
      case '#/home': {
        const homeView = new HomeView();
        homeView.init();
        currentView = homeView;
        currentPresenter = null; // kalau ada presenter buat disini
        break;
      }
      case '#/stories': {
        const storiesView = new StoriesView(storyModel);
        const storiesPresenter = new StoriesPresenter(storiesView, storyModel);
        storiesView.presenter = storiesPresenter;
        storiesView.init();
        currentView = storiesView;
        currentPresenter = storiesPresenter;
        break;
      }
      case '#/add': {
        const addStoryView = new AddStoryView(storyModel);
        const addStoryPresenter = new AddStoryPresenter(addStoryView, storyModel);
        addStoryView.presenter = addStoryPresenter;
        addStoryView.init();
        currentView = addStoryView;
        currentPresenter = addStoryPresenter;
        break;
      }
      case '#/saved': {
        const savedStoriesView = new SavedStoriesView(storyModel);
        const savedStoriesPresenter = new SavedStoriesPresenter(savedStoriesView, storyModel);
        savedStoriesView.presenter = savedStoriesPresenter;
        savedStoriesView.init();
        currentView = savedStoriesView;
        currentPresenter = savedStoriesPresenter;
        break;
      }
      case '#/login': {
        const loginView = new LoginView(authModel);
        loginView.init();
        currentView = loginView;
        currentPresenter = null;
        break;
      }
      case '#/register': {
        const registerView = new RegisterView(authModel);
        registerView.init();
        currentView = registerView;
        currentPresenter = null;
        break;
      }
      default:
        window.location.hash = '#/home';
    }
  }

  window.addEventListener('hashchange', router);
  window.addEventListener('load', router);
}