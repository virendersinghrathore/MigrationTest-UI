import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getSafeFilePath(key: string): string | null {
  const safeKey = path.basename(key).replace(/[^a-zA-Z0-9_-]/g, '');
  if (!safeKey) return null;
  return path.join(DATA_DIR, `${safeKey}.json`);
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      watch: {
        ignored: [
          '**/data/**',
          '**/data/**/*',
          '**/data',
          (file: string) => {
            const normalized = file.replace(/\\/g, '/');
            return normalized.includes('/data/') || normalized.endsWith('/data');
          },
        ],
      },
    },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  // File Storage API
  app.get('/api/storage/:key', (req, res) => {
    const filePath = getSafeFilePath(req.params.key);
    if (!filePath) {
      return res.status(400).json({ error: 'Invalid key' });
    }

    if (fs.existsSync(filePath)) {
      try {
        const data = fs.readFileSync(filePath, 'utf-8');
        res.json(JSON.parse(data));
      } catch (e: any) {
        console.error(`Failed to read file ${filePath}:`, e);
        res.status(500).json({ error: 'Failed to read data' });
      }
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  app.post('/api/storage/:key', (req, res) => {
    const filePath = getSafeFilePath(req.params.key);
    if (!filePath) {
      return res.status(400).json({ error: 'Invalid key' });
    }

    try {
      // Atomic write to avoid partial writes or read race conditions
      const tempPath = `${filePath}.${Date.now()}.${Math.random().toString(36).slice(2, 6)}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(req.body, null, 2), 'utf-8');
      fs.renameSync(tempPath, filePath);
      res.json({ success: true });
    } catch (e: any) {
      console.error(`Failed to save file ${filePath}:`, e);
      res.status(500).json({ error: 'Failed to save data' });
    }
  });

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
  });
}

createServer();
