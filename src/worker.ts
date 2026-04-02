/**
 * Cloudflare Worker entry point
 * Serves static assets and injects hardened security headers on every response.
 */

interface Env {
    ASSETS: Fetcher;
}

// ── Paths to hard-block immediately (no asset fetch) ──────────────────────────
const BAD_PATH_SEGMENTS = [
    '/wp-', '/wordpress', '/xmlrpc', '.php', '/.env', '/.git',
    '/admin', '/phpmyadmin', '/cgi-bin', '/etc/passwd', '/proc/',
    '/shell', '/cmd', '/eval', '/upload', '/.well-known/acme',
    '/actuator', '/api/v1/pods', '/.DS_Store',
  ];

// ── Method allowlist ──────────────────────────────────────────────────────────
const ALLOWED_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

const SECURITY_HEADERS: Record<string, string> = {
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    // Prevent MIME-type sniffing
    'X-Content-Type-Options': 'nosniff',
    // Force HTTPS for 1 year
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    // Minimal referrer leakage
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Legacy XSS filter (belt-and-suspenders for old browsers)
    'X-XSS-Protection': '1; mode=block',
    // Disable features not used by this site
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()',
    // Cross-origin isolation (prevents Spectre-class attacks)
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    'Cross-Origin-Resource-Policy': 'same-site',
    // Content Security Policy
    // Note: unsafe-inline is required by React (event handlers) and Tailwind (inline styles).
    // unsafe-eval has been REMOVED — it was never needed.
    // Google AdSense sources are preserved for monetisation.
    'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://www.googletagservices.com https://adservice.google.com https://static.doubleclick.net https://googleads.g.doubleclick.net https://www.google-analytics.com https://www.googletagmanager.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "img-src 'self' data: blob: https:",
          "font-src 'self' data: https://fonts.gstatic.com",
          "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com",
          "connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com https://www.googletagmanager.com",
          "worker-src blob:",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "upgrade-insecure-requests",
        ].join('; '),
};

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
          const url = new URL(request.url);
          const path = url.pathname.toLowerCase();

      // ── Block disallowed HTTP methods ─────────────────────────────────────────
      if (!ALLOWED_METHODS.has(request.method)) {
              return new Response('Method Not Allowed', { status: 405 });
      }

      // ── Block known attack/probe paths immediately ─────────────────────────────
      if (BAD_PATH_SEGMENTS.some(p => path.includes(p))) {
              return new Response('Not found', { status: 404 });
      }

      // ── Block suspiciously long URLs (> 2048 chars) ───────────────────────────
      if (request.url.length > 2048) {
              return new Response('URI Too Long', { status: 414 });
      }

      // ── Block requests with suspicious query strings ──────────────────────────
      const qs = url.search.toLowerCase();
          const suspiciousQS = ['<script', 'javascript:', 'data:', 'vbscript:', '../', '%2e%2e'];
          if (suspiciousQS.some(s => qs.includes(s))) {
                  return new Response('Bad Request', { status: 400 });
          }

      // ── Fetch the static asset ────────────────────────────────────────────────
      const response = await env.ASSETS.fetch(request);

      // ── Inject security headers ───────────────────────────────────────────────
      const newHeaders = new Headers(response.headers);
          for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
                  newHeaders.set(key, value);
          }

      // Strip headers that leak server info
      newHeaders.delete('Server');
          newHeaders.delete('X-Powered-By');
          newHeaders.delete('Via');

      // Cache: HTML never cached, static assets cached 1 year, text files short-lived
      if (path.endsWith('.html') || path === '/') {
              newHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else if (/\.(js|css|png|jpg|svg|woff2?|ico)$/.test(path)) {
              newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (/\.(txt|xml|json)$/.test(path)) {
              // ads.txt, robots.txt, sitemap.xml — allow re-crawl within 24 hours
            newHeaders.set('Cache-Control', 'public, max-age=86400');
      }

      return new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers: newHeaders,
      });
    },
};
