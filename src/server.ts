import { APP_BASE_HREF } from '@angular/common';
import { CSP_NONCE } from '@angular/core';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import crypto from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

/**
 * Build a Content-Security-Policy header value for the given nonce.
 *
 * Resources used by this application:
 *  - Google Fonts (fonts.googleapis.com for CSS, fonts.gstatic.com for font files)
 *  - ConfigCat (cdn.configcat.com for feature-flag evaluations)
 *  - Vercel Analytics / Speed Insights (relative endpoints, covered by 'self')
 *  - ng-icons (bundled locally)
 */
function buildCsp(nonce: string): string {
  const directives = [
    "default-src 'self'",
    "style-src 'self' 'nonce-" + nonce + "' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "script-src 'self' 'nonce-" + nonce + "'",
    "connect-src 'self' https://*.configcat.com",
    "img-src 'self' data:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
  ];
  return directives.join('; ');
}

/**
 * CSP header for static / prerendered assets where no runtime nonce is available.
 * Prerendered pages have inline styles/scripts from Angular SSR that need
 * either nonces or 'unsafe-inline' to work. Since we can't inject per-request
 * nonces into static files, we use 'unsafe-inline' for compatibility.
 * SSR-rendered pages get a strict nonce-based policy via buildCsp().
 */
function buildStaticCsp(): string {
  const directives = [
    "default-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "script-src 'self' 'unsafe-inline'",
    "connect-src 'self' https://*.configcat.com",
    "img-src 'self' data:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
  ];
  return directives.join('; ');
}

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Security & CSP middleware — set baseline headers on every response.
 * Runs before all route handlers so even static-file responses are covered.
 *
 * The SSR catch-all route overrides the CSP header with a per-request nonce.
 */
app.use((_req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'DENY');
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.set('Content-Security-Policy', buildStaticCsp());
  next();
});

/**
 * Serve prerendered static files (images, fonts, JS bundles, prerendered HTML).
 * express.static calls next() for paths it cannot resolve, allowing fallthrough
 * to the SSR route handler instead of returning 404.
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }),
);

/**
 * SSR catch-all — render unknown routes through Angular Universal.
 * A unique CSP nonce is generated per request, passed via the CSP_NONCE
 * injection token so Angular includes it on inline <style>/<script> elements,
 * and the per-request CSP header overrides the baseline static policy.
 * Cache at CDN level for 1 day, serve stale for 7 days while revalidating.
 */
app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  /* Generate a unique, unpredictable nonce for this request */
  const nonce = crypto.randomBytes(24).toString('base64url');

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [
        { provide: APP_BASE_HREF, useValue: baseUrl },
        { provide: CSP_NONCE, useValue: nonce },
      ],
    })
    .then((html) => {
      res.set('Content-Security-Policy', buildCsp(nonce));
      res.set(
        'Cache-Control',
        'public, s-maxage=86400, stale-while-revalidate=604800',
      );
      res.send(html);
    })
    .catch((err) => next(err));
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default app;
