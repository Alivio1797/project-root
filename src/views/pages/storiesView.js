import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import mapIconURL from '../../assets/icons/map.png'; 

export default class StoriesView {
  constructor(model) {
    this.app = document.getElementById('app');
    this.presenter = null; 
    this.maps = [];

    this.customIcon = L.icon({
      iconUrl: mapIconURL,  
      iconSize: [32, 37],
      iconAnchor: [16, 37],
      popupAnchor: [0, -37],
    });
  }

  init() {
    this.renderLoading();
    this.presenter.init();
  }

  renderLoading() {
    this.app.innerHTML = `<p>Loading stories...</p>`;
  }

  renderStories(stories) {
    this.app.innerHTML = `
      <h2>All Stories</h2>
      <div id="stories-container"></div>
    `;

    const container = this.app.querySelector('#stories-container');

    stories.forEach((story, index) => {
      const el = document.createElement('div');
      el.className = 'story-card';
      el.dataset.id = story.id; // simpan sebagai string (default)
      el.innerHTML = `
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <img src="${story.photoUrl}" alt="${story.name}" style="width:100%; max-width:300px; margin-bottom:8px;" />
        <button class="btn-save-story" style="background:#28a745;color:#fff;border:none;padding:6px 12px;cursor:pointer;border-radius:4px; margin-bottom:8px;">Save Story</button>
        <div id="map-${index}" style="height: 200px; margin-top: 1rem;"></div>
      `;
      container.appendChild(el);

      if (
        typeof story.lat === 'number' && !isNaN(story.lat) &&
        typeof story.lon === 'number' && !isNaN(story.lon)
      ) {
        const map = L.map(`map-${index}`).setView([story.lat, story.lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        L.marker([story.lat, story.lon], { icon: this.customIcon })
          .addTo(map)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`);

        this.maps.push(map);
      }
    });

    this.bindPresenter();
  }

  bindPresenter() {
    const saveButtons = this.app.querySelectorAll('.btn-save-story');
    saveButtons.forEach(btn => {
      btn.onclick = () => {
        const card = btn.closest('.story-card');
        const id = card.dataset.id; // string
        if (this.presenter?.onSave) {
          this.presenter.onSave(id);
        }
      };
    });
  }

  cleanup() {
    this.maps.forEach(map => map.remove());
    this.maps = [];
  }

  showError(message) {
    this.app.innerHTML = `<p style="color:red">${message}</p>`;
  }
}