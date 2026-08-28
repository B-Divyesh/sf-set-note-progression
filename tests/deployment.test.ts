import { describe, expect, it } from 'vitest';
import staticConfig from '../public/staticwebapp.config.json';

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
});
