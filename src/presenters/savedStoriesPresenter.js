// src/presenters/savedStoriesPresenter.js

export default class SavedStoriesPresenter {
  /**
   * @param {object} view  An instance of SavedStoriesView
   * @param {object} model An instance of StoryModel
   */
  constructor(view, model) {
    this.view = view;
    this.model = model;
    // Wire up the view’s delete callback to this presenter
    this.view.onDelete = this.onDelete.bind(this);
  }

  /**
   * Initialize the view.
   * Fetches and renders saved stories.
   */
  init() {
    this.view.init();
  }

  /**
   * Called when the user clicks a Delete button.
   * @param {number} id - The ID of the story to delete.
   */
  async onDelete(id) {
    // Ask for confirmation
    if (!confirm('Delete this saved story?')) {
      return;
    }

    try {
      // Remove from IndexedDB
      await this.model.deleteStory(id);
      // Re-render the list and re-bind delete buttons
      await this.view.render();
      this.view.bindPresenter();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete story: ' + err.message);
    }
  }
}