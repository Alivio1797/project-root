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
      const registration = await navigator.serviceWorker.ready;
      const existing = await registration.pushManager.getSubscription();
      if (!existing) {
        const key = 'BAEYDXBp5IVfy8RtJ6egDBJfT0T04Vd4E8ttcsbWOroiodoMQo3hhhtSvfHE8EwKibi-zkyq01vGhXb48urE2WA'; 
        const applicationServerKey = this.urlBase64ToUint8Array(key);
        await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey });
      }
     
      const subscription = await registration.pushManager.getSubscription();
      await fetch('/subscribe', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(subscription)
      });
      this.isSubscribed = true;
      this.view.updateNav();
      alert('Berhasil subscribe notifikasi!');
    } catch (err) {
      console.error('Subscribe failed:', err);
      alert('Gagal subscribe: ' + err.message);
    }
  }

  async onUnsubscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        await fetch('/unsubscribe', {
          method: 'POST', headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ endpoint: sub.endpoint })
        });
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
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
  }

  updateNav() {
    this.view.updateNav();
  }
}