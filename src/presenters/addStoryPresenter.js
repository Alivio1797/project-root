export default class AddStoryPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.cameraStream = null;

    this.onCameraStarted = this.onCameraStarted.bind(this);
    this.onCapturePhoto = this.onCapturePhoto.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  init() {
    this.view.render();
    this.view.bindPresenter(this);
  }

  async onCameraStarted() {
    try {
      this.cameraStream = await this.view.startCamera();
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  async onCapturePhoto() {
    try {
      const file = await this.view.capturePhoto();
      this.view.showPreviewImage(file);
      this.view.photoFile = file;
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  async onSubmit({ description, photoFile, lat, lon }) {
    try {
      await this.model.addStory({ description, photoFile, lat, lon });
      this.view.navigateTo('/stories');
    } catch (error) {
      this.view.showError('Gagal menambahkan story: ' + error.message);
    }
  }

  cleanup() {
    if (this.cameraStream) {
      this.view.stopCamera(this.cameraStream);
      this.cameraStream = null;
    }
    if (this.view.cleanup) {
      this.view.cleanup();
    }
  }
}