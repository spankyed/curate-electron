import { app } from 'electron';
import { Server } from 'node-static';
import http from 'node:http';
import path from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

const userDataPath = app.getPath('userData');
export const arxivPdfDir = path.join(userDataPath, 'arxiv-pdfs');

const ensureDirectoryExists = () => {
  if (!existsSync(arxivPdfDir)) {
    mkdirSync(arxivPdfDir);
  }
};

let server: http.Server | null = null;

export const getServerAddress = () => {
  const address = server?.address(); // Type can be string | AddressInfo | null

  if (address && typeof address !== 'string') {
    return `http://localhost:${address.port}`;
  }

  return null;
};

export const handleStaticFiles = () => {
  ensureDirectoryExists();

  const fileServer = new Server(arxivPdfDir);

  server = http.createServer((req, res) => {
    // Set CORS headers to allow cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    req
      .addListener('end', () => {
        fileServer.serve(req, res);
      })
      .resume();
  });
  // server = http.createServer((req, res) => {
  //   req
  //     .addListener('end', () => {
  //       fileServer.serve(req, res);
  //     })
  //     .resume();
  // });

  // Start the server on a dynamic port
  server.listen(0, 'localhost', () => {
    const address = server?.address();

    if (address && typeof address !== 'string') {
      const port = address.port;
      console.log(`Static server running at http://localhost:${port}`);
    } else {
      console.error('Failed to retrieve server address.');
    }
  });

  // Handle server shutdown when the app quits
  app.on('before-quit', () => {
    server?.close(() => {
      console.log('Static server closed');
    });
  });
};
