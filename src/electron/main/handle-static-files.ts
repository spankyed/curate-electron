import { app, protocol, net } from 'electron';
import path from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import fs from 'node:fs/promises'; // For promise-based file system operations
import { pathToFileURL } from 'node:url';

export const arxivPdfDir = path.join(app.getPath('userData'), 'arxiv-pdfs');
export const thumbnailDir = path.join(app.getPath('userData'), 'thumbnails');

if (!existsSync(arxivPdfDir)) {
  mkdirSync(arxivPdfDir);
}

if (!existsSync(thumbnailDir)) {
  mkdirSync(thumbnailDir);
}

const options = {
  isCorsEnabled: true,
  scheme: 'static', // Custom protocol scheme (like app://)
  // hostname: '-', // Can be ignored for local files
  // file: 'index', // Default file to serve (if needed)
};

protocol.registerSchemesAsPrivileged([
  {
    scheme: options.scheme,
    privileges: {
      bypassCSP: true,
      standard: true,
      secure: true,
      allowServiceWorkers: true,
      supportFetchAPI: true,
      corsEnabled: options.isCorsEnabled, // Enable CORS
    },
  },
]);

export const handleStaticFiles = () => {
  protocol.handle(options.scheme, async (req) => {
    const { pathname, hostname } = new URL(req.url);

    // Map hostnames to directories
    const folderMap = {
      'local.arxiv': arxivPdfDir,
      'local.thumbnails': thumbnailDir,
    };

    const baseDir = folderMap[hostname];

    if (!baseDir) {
      // Return 404 if the hostname does not map to a known folder
      return new Response('Host Folder Not Found', {
        status: 404,
        headers: { 'content-type': 'text/plain' },
      });
    }

    const requestedPath = path.join(baseDir, decodeURIComponent(pathname));
    const relativePath = path.relative(baseDir, requestedPath);
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

export const getPDFAddress = (arxivId) => {
  return `${options.scheme}://local.arxiv/${arxivId}.pdf`;
};
