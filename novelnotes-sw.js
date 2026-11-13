self.addEventListener('push', (event) => {
  let payload = {};
  try { payload = event.data ? event.data.json() : {}; } catch {}
  const title = typeof payload.title === 'string' ? payload.title : 'Rappel Novel Notes';
  const options = {
    body: typeof payload.body === 'string' ? payload.body : 'Tu as un rappel prévu.',
    icon: './favicon.png',
    badge: './favicon.png',
    tag: typeof payload.tag === 'string' ? payload.tag : 'novelnotes-reminder',
    data: { url: typeof payload.url === 'string' ? payload.url : './' },
    renotify: false,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || './', self.registration.scope).href;
  event.waitUntil((async () => {
    const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientsList) {
      if ('focus' in client) {
        await client.focus();
        if ('navigate' in client) await client.navigate(target);
        return;
      }
    }
    if (self.clients.openWindow) await self.clients.openWindow(target);
  })());
});
