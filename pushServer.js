import express from 'express';
import webpush from 'web-push';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PUBLIC_VAPID_KEY = 'BAEYDXBp5IVfy8RtJ6egDBJfT0T04Vd4E8ttcsbWOroiodoMQo3hhhtSvfHE8EwKibi-zkyq01vGhXb48urE2WA';
const PRIVATE_VAPID_KEY = 'NJ_GpaYk0IcdRuK3PdOC8WYKCyR5ozpbluBTp4zwsLM';

webpush.setVapidDetails(
  'mailto:you@domain.com',
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
);

let subscriptions = [];

app.post('/subscribe', (req, res) => {
  console.log('[/subscribe] New subscription received:', req.body);

  const exists = subscriptions.find(sub => sub.endpoint === req.body.endpoint);
  if (!exists) {
    subscriptions.push(req.body);
  }

  res.status(201).json({ ok: true });
});

app.post('/unsubscribe', (req, res) => {
  const { endpoint } = req.body;
  subscriptions = subscriptions.filter(sub => sub.endpoint !== endpoint);
  console.log('[/unsubscribe] Unsubscribed:', endpoint);
  res.status(200).json({ ok: true });
});

app.post('/push', async (req, res) => {
  const { title, body } = req.body;
  const payload = JSON.stringify({ title, body });

  console.log(`[/push] Triggering push to ${subscriptions.length} subscriber(s)`);

  try {
    await Promise.all(
      subscriptions.map(sub => webpush.sendNotification(sub, payload))
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Push error:', err);
    res.sendStatus(500);
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Push server running at http://localhost:${PORT}`);
  console.log(`🔑 VAPID Public Key: ${PUBLIC_VAPID_KEY}`);
});