export async function startCamera(videoElement) {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoElement.srcObject = stream;
  await videoElement.play();
  return stream;
}

// Hentikan stream kamera dengan aman
export function stopCamera(stream) {
  if (!stream) return;
  try {
    stream.getTracks().forEach(track => track.stop());
  } catch (err) {
    console.error('Error stopping camera:', err);
  }
}

// Tambahkan fungsi capturePhoto ini
export async function capturePhoto(videoElement, canvasElement) {
  // atur ukuran canvas sesuai video
  canvasElement.width  = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
  const ctx = canvasElement.getContext('2d');
  ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

  // konversi ke Blob lalu File
  return new Promise(resolve => {
    canvasElement.toBlob(blob => {
      const file = new File([blob], 'story-photo.jpg', { type: blob.type });
      resolve(file);
    }, 'image/jpeg');
  });
}