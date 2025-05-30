// src/presenters/storiesPresenter.js

export default class StoriesPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    // agar view bisa memanggil presenter:
    this.view.presenter = this;
  }

  /**
   * Fetch remote stories, render, lalu bind tombol Save
   */
  async init() {
    try {
      const stories = await this.model.getAllStories();
      this.view.renderStories(stories);
      this.view.bindPresenter();  // ⚠️ pastikan bind setelah render
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  /**
   * Melepaskan resource (misal peta)
   */
  cleanup() {
    if (this.view.cleanup) {
      this.view.cleanup();
    }
  }

  /**
   * Dipanggil oleh StoriesView saat tombol Save diklik
   * @param {number|string} id 
   */
  async onSave(id) {
    try {
      // ambil daftar terbaru
      const stories = await this.model.getAllStories();
      // samakan tipe id untuk mencocokkan
      const story = stories.find(s => String(s.id) === String(id));
      if (!story) throw new Error('Story not found');

      // unduh gambarnya sebagai Blob
      const resp = await fetch(story.photoUrl);
      if (!resp.ok) throw new Error('Failed to download image');
      const blob = await resp.blob();

      // simpan lokal
      await this.model.saveStory({
        description: story.description,
        photoFile: blob,
        lat: story.lat,
        lon: story.lon,
      });

      alert('Story saved locally!');
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save story: ' + err.message);
    }
  }
}