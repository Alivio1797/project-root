// src/views/pages/savedStoriesView.js
export default class SavedStoriesView {
  constructor(model) {
    this.model = model;
    // target the existing <section id="app">
    this.app = document.getElementById('app');
  }

  async init() {
    await this.render();
    this.bindPresenter();
  }

  async render() {
    const stories = await this.model.getStories();
    // Render only inside #app
    this.app.innerHTML = `
      <h2>Saved Stories</h2>
      ${stories.length === 0 ? '<p>No saved stories.</p>' : ''}
      <ul id="saved-stories-list" style="list-style:none; padding:0;">
        ${stories.map(s => `
          <li data-id="${s.id}" style="border:1px solid #ccc; padding:8px; margin:4px 0; display:flex; align-items:center; gap:8px;">
            <img src="${URL.createObjectURL(s.photoFile)}" alt="Saved story" width="80" height="80" style="object-fit:cover; border-radius:4px;" />
            <div style="flex:1;">
              <p style="margin:0; font-weight:bold;">${s.description}</p>
              <small>${new Date(s.created).toLocaleString()}</small>
            </div>
            <button class="btn-delete" style="background:#e00; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Delete</button>
          </li>
        `).join('')}
      </ul>
    `;
  }

  bindPresenter() {
    // Now bind events inside #app
    this.app.querySelectorAll('.btn-delete').forEach(btn => {
      btn.onclick = () => {
        const li = btn.closest('li');
        const id = Number(li.dataset.id);
        // presenter should have been set as this.view.presenter
        this.presenter?.onDelete(id);
      };
    });
  }
}