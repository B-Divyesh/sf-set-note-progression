import { describe, expect, it } from 'vitest';
import staticConfig from '../public/staticwebapp.config.json';
import { readFileSync } from 'node:fs';

interface StaticRoute { route: string; rewrite?: string; headers?: Record<string, string> }

describe('static deployment policy', () => {
  const config = staticConfig as {
    navigationFallback?: unknown;
    routes: StaticRoute[];
    responseOverrides: Record<string, { rewrite: string }>;
  };

  it('serves only known application routes through the SPA shell', () => {
    expect(config.navigationFallback).toBeUndefined();
    const rewrites = Object.fromEntries(config.routes.filter((route) => route.rewrite).map((route) => [route.route, route.rewrite]));
    expect(rewrites).toMatchObject({
      '/': '/index.html', '/log': '/index.html', '/demo': '/index.html',
      '/backup': '/index.html', '/privacy': '/index.html', '/terms': '/index.html',
    });
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
  });

  it('gives content-hashed bundles an immutable one-year cache policy', () => {
    const assets = config.routes.find((route) => route.route === '/assets/*');
    expect(assets?.headers?.['Cache-Control']).toBe('public, max-age=31536000, immutable');
  });

  it('ships a branded 404 with full metadata, navigation, and legal links', () => {
    const html = readFileSync(new URL('../public/404.html', import.meta.url), 'utf8');
    expect(html).toContain('<header class="site-header">');
    expect(html).toContain('<footer class="site-footer">');
    expect(html).toContain('<meta name="description"');
    expect(html).toContain('<link rel="canonical"');
    expect(html).toContain('property="og:title"');
    expect(html).toContain('name="twitter:title"');
    expect(html).toContain('rel="icon"');
    expect(html).toContain('href="/privacy"');
    expect(html).toContain('href="/terms"');
    expect((html.match(/<h1[ >]/g) ?? [])).toHaveLength(1);
  });
});
