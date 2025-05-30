import AddStoryPresenter from '../../presenters/addStoryPresenter.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import mapIconURL from '../../assets/icons/map.png'; 

export default class AddStoryView {
  constructor(model) {
    this.app = document.getElementById('app');
    this.presenter = new AddStoryPresenter(this, model);
    this.cameraStream = null;
    this.photoFile = null;
    this.map = null;
    this.marker = null;
    this.locationInfo = 'Alamat belum tersedia';

    // Custom icon Leaflet, sesuaikan path dengan file icon di folder publik
    this.customIcon = L.icon({
      iconUrl: mapIconURL,  // pastikan file ini ada dan bisa diakses
      iconSize: [32, 37],
      iconAnchor: [16, 37],
      popupAnchor: [0, -37],
    });
  }

  init() {
    this.render();
    this.bindPresenter();
    this.presenter.init();
    this.initMap(-7.797068, 110.370529);
  }

  render() {
    this.app.innerHTML = `
      <form id="add-story-form">
        <label for="description">Deskripsi Cerita:</label>
        <textarea id="description" required minlength="10" placeholder="Deskripsi cerita"></textarea>

        <button type="button" id="camera-btn">Open Camera</button>

        <label for="file-input" class="sr-only">Unggah Foto</label>
        <input type="file" id="file-input" accept="image/*" style="display:none;" />
        <button type="button" id="file-btn">Upload Photo</button>

        <button type="button" id="capture-btn">Capture Photo</button>

        <video id="camera-preview" autoplay playsinline style="display:none;"></video>
        <img id="preview-img" style="display:none; width:100px; height:100px; object-fit:cover; margin-top: 10px;" />

        <button type="button" id="location-btn">Get My Location</button>
        <div id="location-name"></div>

        <input type="hidden" id="lat" />
        <input type="hidden" id="lon" />

        <div id="map" style="height: 300px; width: 100%; margin-top: 1rem;"></div>

        <button type="submit">Publish Story</button>
      </form>
    `;
  }

  bindPresenter() {
    const form = this.app.querySelector('#add-story-form');
    const cameraBtn = this.app.querySelector('#camera-btn');
    const captureBtn = this.app.querySelector('#capture-btn');
    const locationBtn = this.app.querySelector('#location-btn');
    const fileBtn = this.app.querySelector('#file-btn');
    const fileInput = this.app.querySelector('#file-input');

    form.addEventListener('submit', e => {
      e.preventDefault();
      this.presenter.onSubmit({
        description: this.app.querySelector('#description').value,
        photoFile: this.photoFile,
        lat: +this.app.querySelector('#lat').value,
        lon: +this.app.querySelector('#lon').value,
      });
    });

    cameraBtn.addEventListener('click', () => this.presenter.onCameraStarted());
    captureBtn.addEventListener('click', () => this.presenter.onCapturePhoto());
    locationBtn.addEventListener('click', () => this.getLocation());
    fileBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => this.onFileSelected(fileInput.files));
  }

  initMap(lat, lon) {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.marker = L.marker([lat, lon], { 
      draggable: true,
      icon: this.customIcon  // jika pakai custom icon, opsional
    }).addTo(this.map);

  
    this.marker.bindPopup(this.locationInfo).openPopup();

    this.marker.on('click', () => this.marker.openPopup());

    this.marker.on('dragend', e => {
      const pos = e.target.getLatLng();
      this.app.querySelector('#lat').value = pos.lat;
      this.app.querySelector('#lon').value = pos.lng;

      this.locationInfo = `Koordinat: ${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}`;
      this.marker.setPopupContent(this.locationInfo).openPopup();

      this.app.querySelector('#location-name').textContent = this.locationInfo;
    });
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        this.app.querySelector('#lat').value = latitude;
        this.app.querySelector('#lon').value = longitude;

        this.locationInfo = `Koordinat: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        this.app.querySelector('#location-name').textContent = this.locationInfo;

        this.initMap(latitude, longitude);
      },
      err => alert('Gagal mendapatkan lokasi: ' + err.message),
      { enableHighAccuracy: true }
    );
  }

  async startCamera() {
    try {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = this.app.querySelector('#camera-preview');
      videoElement.srcObject = this.cameraStream;
      videoElement.style.display = 'block';
      await videoElement.play();
      return this.cameraStream;
    } catch (error) {
      this.showError('Tidak bisa mengakses kamera: ' + error.message);
      throw error;
    }
  }

  stopCamera(stream) {
    if (!stream) return;
    stream.getTracks().forEach(track => track.stop());
    const videoElement = this.app.querySelector('#camera-preview');
    if (videoElement) {
      videoElement.srcObject = null;
      videoElement.style.display = 'none';
    }
  }

  async capturePhoto() {
    const videoElement = this.app.querySelector('#camera-preview');
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0);
    return new Promise(resolve => {
      canvas.toBlob(blob => {
        const file = new File([blob], 'photo.jpg', { type: blob.type });
        this.showPreviewImage(file);
        this.photoFile = file;
        resolve(file);
      }, 'image/jpeg');
    });
  }

  showPreviewImage(file) {
    const previewImg = this.app.querySelector('#preview-img');
    previewImg.src = URL.createObjectURL(file);
    previewImg.style.display = 'block';
  }

  onFileSelected(files) {
    const file = files[0];
    if (file) {
      this.showPreviewImage(file);
      this.photoFile = file;
    }
  }

  showError(message) {
    alert(message);
  }

  navigateTo(hash) {
    window.location.hash = hash;
  }
}