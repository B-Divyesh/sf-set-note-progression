const SLUG = 'set-note-progression';
const LICENSE_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${SLUG}`;
const DAY = 86_400_000;

interface Verdict { valid: boolean; checkedAt: number; reason: string }

export function captureLicense(): boolean {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return false;
  localStorage.setItem(LICENSE_KEY, token);
  localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: true, checkedAt: 0, reason: 'pending' }));
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  return true;
}

export function saveLicense(token: string): void {
  localStorage.setItem(LICENSE_KEY, token.trim());
  localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: true, checkedAt: 0, reason: 'pending' }));
}

export function removeLicense(): void {
  localStorage.removeItem(LICENSE_KEY);
  localStorage.removeItem(VERDICT_KEY);
}

export function hasPaidAccess(): boolean {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return false;
  const cached = readVerdict();
  return cached?.valid !== false;
}

function readVerdict(): Verdict | null {
  try { return JSON.parse(localStorage.getItem(VERDICT_KEY) ?? 'null') as Verdict | null; }
  catch { return null; }
}

export async function verifyLicense(force = false): Promise<{ valid: boolean; reason: string } | null> {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return null;
  const cached = readVerdict();
  if (!force && cached && Date.now() - cached.checkedAt < DAY) return cached;
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('verify failed');
    const data = await response.json() as { valid: boolean; reason: string };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ ...data, checkedAt: Date.now() }));
    return data;
  } catch {
    return cached;
  }
}

export const checkoutUrl = `https://api.sociobot.in/api/v1/products/${SLUG}/checkout`;
