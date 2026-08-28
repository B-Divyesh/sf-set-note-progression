const SLUG = 'set-note-progression';
const DAY = 86_400_000;

interface Verdict { valid: boolean; checkedAt: number; reason: string }

function keys(demo: boolean): { license: string; verdict: string } {
  const prefix = demo ? 'demo:' : '';
  return {
    license: `${prefix}sb_license:${SLUG}`,
    verdict: `${prefix}sb_license_verdict:${SLUG}`,
  };
}

export function captureLicense(demo = false): boolean {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return false;
  const storage = keys(demo);
  localStorage.setItem(storage.license, token);
  localStorage.setItem(storage.verdict, JSON.stringify({ valid: true, checkedAt: 0, reason: 'pending' }));
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  return true;
}

export function saveLicense(token: string, demo = false): void {
  const storage = keys(demo);
  localStorage.setItem(storage.license, token.trim());
  localStorage.setItem(storage.verdict, JSON.stringify({ valid: true, checkedAt: 0, reason: 'pending' }));
}

export function removeLicense(demo = false): void {
  const storage = keys(demo);
  localStorage.removeItem(storage.license);
  localStorage.removeItem(storage.verdict);
}

export function clearDemoLicense(): void {
  removeLicense(true);
}

export function hasPaidAccess(demo = false): boolean {
  const storage = keys(demo);
  const token = localStorage.getItem(storage.license);
  if (!token) return false;
  const cached = readVerdict(demo);
  return cached?.valid !== false;
}

function readVerdict(demo: boolean): Verdict | null {
  try { return JSON.parse(localStorage.getItem(keys(demo).verdict) ?? 'null') as Verdict | null; }
  catch { return null; }
}

export async function verifyLicense(force = false, demo = false): Promise<{ valid: boolean; reason: string } | null> {
  const storage = keys(demo);
  const token = localStorage.getItem(storage.license);
  if (!token) return null;
  const cached = readVerdict(demo);
  if (!force && cached && Date.now() - cached.checkedAt < DAY) return cached;
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('verify failed');
    const data = await response.json() as { valid: boolean; reason: string };
    localStorage.setItem(storage.verdict, JSON.stringify({ ...data, checkedAt: Date.now() }));
    return data;
  } catch {
    return cached;
  }
}

export const checkoutUrl = `https://api.sociobot.in/api/v1/products/${SLUG}/checkout`;
