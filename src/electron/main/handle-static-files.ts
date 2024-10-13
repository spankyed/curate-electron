import { app, protocol, net } from 'electron';
import path from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import fs from 'node:fs/promises'; // For promise-based file system operations
import { pathToFileURL } from 'node:url';

export const arxivPdfDir = path.join(app.getPath('userData'), 'arxiv-pdfs');

if (!existsSync(arxivPdfDir)) {
  // Ensure the arxiv-pdfs directory exists
  mkdirSync(arxivPdfDir);
}

const finalOptions = {
  isCorsEnabled: true,
  scheme: 'static', // Custom protocol scheme (like app://)
  hostname: '-', // Can be ignored for local files
  // file: 'index', // Default file to serve (if needed)
};

protocol.registerSchemesAsPrivileged([
  {
    scheme: finalOptions.scheme,
    privileges: {
      bypassCSP: true,
      standard: true,
      secure: true,
      allowServiceWorkers: true,
      supportFetchAPI: true,
      corsEnabled: finalOptions.isCorsEnabled, // Enable CORS
    },
  },
]);

export const handleStaticFiles = () => {
  protocol.handle(finalOptions.scheme, async (req) => {
    const { pathname } = new URL(req.url);
    const requestedPath = path.join(arxivPdfDir, decodeURIComponent(pathname));

    const relativePath = path.relative(arxivPdfDir, requestedPath);
    const isSafe = !relativePath.startsWith('..') && !path.isAbsolute(relativePath);

    if (!isSafe) {
      return new Response('Access Denied', { status: 403 });
    }

    try {
      const fileStat = await fs.stat(requestedPath);
      if (fileStat.isFile()) {
        // Serve the file using Electron's net.fetch for file streaming
        return net.fetch(pathToFileURL(requestedPath).toString());
      }
    } catch (error) {
      return new Response('File Not Found', {
        status: 404,
        headers: { 'content-type': 'text/plain' },
      });
    }

    return new Response('File Not Found', {
      status: 404,
      headers: { 'content-type': 'text/plain' },
    });
  });
};

export const getProtocolAddress = () => {
  // Instead of returning an HTTP URL, return the custom protocol URL
  return `${finalOptions.scheme}://${finalOptions.hostname}/`;
};
