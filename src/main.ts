import './styles.css';
import { notifyUpdate, startApp } from './app';

void startApp();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  addEventListener('load', async () => {
    const hadController = Boolean(navigator.serviceWorker.controller);
    const registration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
    const loadedAssets = Array.from(document.querySelectorAll<HTMLScriptElement | HTMLLinkElement>('script[src], link[rel="stylesheet"]'))
      .map((element) => element instanceof HTMLScriptElement ? element.src : element.href)
      .filter((url) => new URL(url).origin === location.origin);
    await (await caches.open('snp-loaded-v1')).addAll(loadedAssets);
    if (registration.waiting) notifyUpdate(registration);
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) notifyUpdate(registration);
      });
    });
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController && !refreshing) { refreshing = true; location.reload(); }
    });
  });
}
