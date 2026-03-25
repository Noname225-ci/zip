/**
 * Cloudflare Worker entry point
 * Serves static assets and injects security headers on every response.
 */

interface Env {
  ASSETS: Fetcher;
}

const SECURITY_HEADERS: Record<string, string> = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  // Prevent MIME-type sniffing
  'X-Content-Type-Options': 'nosniff',
  // Force HTTPS for 1 year, include subdomains, allow preload list
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  // Only send origin on cross-origin requests
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Disable features not needed by this site
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  // Content Security Policy
  // - Allows Google AdSense scripts & iframes
  // - Allows inline styles/scripts (required by React + Tailwind)
  // - Blocks everything else by default
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://www.googletagservices.com https://adservice.google.com https://static.doubleclick.net https://googleads.g.doubleclick.net https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com",
    "connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; '),
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Block obviously malicious request patterns
    const url = new URL(request.url);
    const path = url.pathname.toLowerCase();

    // Drop requests probing for WordPress, PHP, common attack paths
    const badPaths = [
      '/wp-', '/wordpress', '/xmlrpc', '.php', '/.env',
      '/admin', '/phpmyadmin', '/cgi-bin', '/etc/passwd',
    ];
    if (badPaths.some(p => path.includes(p))) {
      return new Response('Not found', { status: 404 });
    }

    // Fetch the static asset
    const response = await env.ASSETS.fetch(request);

    // Clone headers and inject security headers
    const newHeaders = new Headers(response.headers);
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      newHeaders.set(key, value);
    }

    // Remove headers that leak server info
    newHeaders.delete('Server');
    newHeaders.delete('X-Powered-By');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
