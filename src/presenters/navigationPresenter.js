export default class NavigationPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.isSubscribed = false;
  }

  async init() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      this.isSubscribed = !!sub;
    }
    this.view.updateNav();
  }

  onLogout() {
    this.model.logout();
    window.location.hash = '#/login';
    window.dispatchEvent(new Event('user-logout'));
  }

  async onSubscribe() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        alert('Izin notifikasi tidak diberikan.');
        return;
      }

      const vapidKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
      const convertedKey = this.urlBase64ToUint8Array(vapidKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      });

      console.log('Push Subscription:', JSON.stringify(subscription, null, 2));

      // Jika kamu tidak punya endpoint backend, jangan lakukan POST
      alert('Berhasil subscribe notifikasi.');

      this.isSubscribed = true;
      this.view.updateNav();
    } catch (err) {
      console.error('Subscribe error:', err);
      alert('Gagal subscribe: ' + err.message);
    }
  }

  async onUnsubscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        // Tidak perlu kirim ke server jika tidak ada backend
        console.log('Push subscription canceled.');
      }

      this.isSubscribed = false;
      this.view.updateNav();
      alert('Berhasil unsubscribe notifikasi!');
    } catch (err) {
      console.error('Unsubscribe failed:', err);
      alert('Gagal unsubscribe: ' + err.message);
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
  }

  updateNav() {
    this.view.updateNav();
  }
}