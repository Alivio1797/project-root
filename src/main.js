import './styles/pages/main.css';
import './styles/components/navigation.css';
import App from './app';
import 'regenerator-runtime/runtime';

document.addEventListener('DOMContentLoaded', () => {
  App();

  const mainContent = document.querySelector('#main-content');
  const skipLink = document.querySelector('.skip-link');

  if (mainContent && skipLink) {
    skipLink.addEventListener('click', function (event) {
      event.preventDefault();
      skipLink.blur();
      mainContent.focus();
      mainContent.scrollIntoView();
    });
  }

  // ==== REGISTER SERVICE WORKER & PWA INSTALL PROMPT ====
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    window.addEventListener('load', async () => {
      // 1) Register service worker
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', reg);

      // 2) Handle PWA install prompt
      let deferredPrompt;
      window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault();
        deferredPrompt = e;
        const installBtn = document.createElement('button');
        installBtn.textContent = 'Install App';
        installBtn.id = 'install-button';
        document.body.appendChild(installBtn);

        installBtn.addEventListener('click', async () => {
          installBtn.disabled = true;
          deferredPrompt.prompt();
          const choiceResult = await deferredPrompt.userChoice;
          console.log('PWA install outcome:', choiceResult.outcome);
          document.getElementById('install-button')?.remove();
          deferredPrompt = null;
        });
      });
    });
  }
});