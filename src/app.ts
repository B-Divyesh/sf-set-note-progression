import { decryptBackup, encryptBackup } from './crypto';
import {
  deleteExercise, deleteSession, ensureDemoSeeded, listExercises, listSessions, makeBackup,
  resetDemo, restoreBackup, saveExercise, saveSession,
} from './db';
import { captureLicense, checkoutUrl, clearDemoLicense, hasPaidAccess, removeLicense, saveLicense, verifyLicense } from './license';
import { formatLoad, nextSuggestion, ruleText } from './progression';
import type { Backup, EncryptedBackup, Exercise, LoggedSet, Session } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
const NOTE_TAGS = ['Clean reps', 'Paused', 'Felt easy', 'Grip slipped', 'Form broke'];
const BUILD_ID = 'v1.0.1';
const DEMO_SESSION_KEY = 'demo:set-note-progression:active';
let selectedExerciseId = '';
let editingExerciseId = '';
let lastSuggestion: Session['suggestion'] | null = null;
let notice = '';

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);
}

function path(): string {
  const clean = location.pathname.replace(/\/+$/, '');
  return clean || '/';
}

function isDemo(): boolean {
  return path() === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
}

function routeTitle(route: string): string {
  const titles: Record<string, string> = {
    '/': 'Set Note Progression — Know what to lift next',
    '/log': 'Workout log — Set Note Progression',
    '/demo': 'Demo — Set Note Progression',
    '/backup': 'Backup — Set Note Progression',
    '/privacy': 'Privacy — Set Note Progression',
    '/terms': 'Terms — Set Note Progression',
    '/404': 'Page not found — Set Note Progression',
  };
  return titles[route] ?? titles['/404'];
}

function header(demo: boolean): string {
  const demoSuffix = demo ? '?demo=1' : '';
  return `
    <a class="skip-link" href="#main">Skip to main content</a>
    ${demo ? `<aside class="demo-banner" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved</strong><span><button class="text-button" data-action="reset-demo">Reset demo</button><a data-route href="/log">Start for real</a></span></aside>` : ''}
    <header class="site-header">
      <a class="wordmark" data-route href="${demo ? '/demo' : '/'}" aria-label="Set Note Progression home"><span class="mark" aria-hidden="true"><i></i><i></i><i></i></span><span>Set Note<br>Progression</span></a>
      <nav aria-label="Main navigation">
        <a data-route href="${demo ? '/demo' : '/log'}">Log</a><a data-route href="/demo">Demo</a><a data-route href="/backup${demoSuffix}">Backup</a><a data-route href="/privacy${demoSuffix}">Privacy</a>
      </nav>
      <span class="network-state" data-network aria-live="polite">${navigator.onLine ? 'Online' : 'Offline · changes stay here'}</span>
    </header>`;
}

function footer(demo = false): string {
  const suffix = demo ? '?demo=1' : '';
  return `<footer class="site-footer">
    <p>Log set details and get the next-load rule.</p>
    <nav aria-label="Footer"><a data-route href="/privacy${suffix}">Privacy</a><a data-route href="/terms${suffix}">Terms</a><a href="https://hello-factory.sociobot.in/" target="_blank" rel="noreferrer">Built by Param Factory <span class="sr-only">(opens in a new tab)</span></a></nav>
    <p>${BUILD_ID} · Original generated artwork</p>
  </footer>`;
}

function shell(content: string, demo = false): string {
  return `${header(demo)}<main id="main" tabindex="-1">${content}</main>${footer(demo)}<div class="route-announcer sr-only" aria-live="polite"></div><div class="toast" data-toast role="status" aria-live="polite"></div>`;
}

function homePage(): string {
  return shell(`
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">A local workout log with one visible rule</p>
        <h1>Log each set. Know what changes next.</h1>
        <p class="lede">For lifters who forget why a set changed and want the next load decided from their notes.</p>
        <div class="hero-actions"><a class="button primary" data-route href="/demo">Try it with sample data</a><span>See a finished workout and its next load.</span></div>
        <a class="quiet-link" data-route href="/log">Start my workout log</a>
        <ul class="plain-facts" aria-label="Product facts">
          <li><strong>Private.</strong> Your workout log stays in this browser.</li>
          <li><strong>Offline.</strong> Reopen it after your first visit.</li>
          <li><strong>Free core.</strong> Log three exercises. Unlimited exercises cost $19 once.</li>
        </ul>
      </div>
      <div class="hero-art">
        <picture>
          <source srcset="/art/load-constellation-768.webp 768w, /art/load-constellation.webp 1280w" type="image/webp">
          <img src="/art/load-constellation.webp" width="1280" height="853" alt="Abstract weight plates and rep dots converge on one next-step marker." fetchpriority="high" decoding="async">
        </picture>
        <div class="specimen" aria-label="Example next-session suggestion">
          <span class="decision-label">Next session · increase</span>
          <strong>62.5 kg</strong>
          <p>All 3 sets reached 12 reps. No limiting chip was selected.</p>
        </div>
      </div>
    </section>
    <section class="preview-section" aria-labelledby="preview-title">
      <div><p class="section-index">01 / The rule</p><h2 id="preview-title">Your rule chips control the answer</h2><p>A missed rep and a slipped grip should not lead to the same advice. This log keeps both facts beside the set.</p></div>
      <div class="rule-board">
        <div><span class="rep-dots"><i></i><i></i><i></i></span><strong>Every set reaches the top</strong><span>Increase the load</span></div>
        <div><span class="rep-dots mixed"><i></i><i></i><i></i></span><strong>Sets stay inside the range</strong><span>Add reps</span></div>
        <div><span class="rep-dots hold"><i></i><i></i><i></i></span><strong>A set falls short or has a limiting chip</strong><span>Hold the load</span></div>
      </div>
    </section>
    <section class="steps" aria-labelledby="steps-title">
      <p class="section-index">02 / One session</p><h2 id="steps-title">How it works</h2>
      <ol><li><span>1</span><div><h3>Set the rep range</h3><p>Add the exercise, working sets, load step, and rep range.</p></div></li><li><span>2</span><div><h3>Note each set</h3><p>Log reps and select a rule chip when grip or form limits a set.</p></div></li><li><span>3</span><div><h3>Read the reason</h3><p>See hold, add reps, or increase with the exact rule underneath.</p></div></li></ol>
    </section>
    <section class="boundaries" aria-labelledby="boundaries-title"><div><p class="section-index">03 / Clear limits</p><h2 id="boundaries-title">A log, not a coach</h2></div><p>It does not create workouts, judge pain, or promise results. Stop if a movement feels unsafe and seek qualified help.</p></section>
    <section class="pricing" aria-labelledby="pricing-title"><div><p class="section-index">04 / One-time license</p><h2 id="pricing-title">Keep three exercises free</h2><p>Every account-free logging and backup tool stays included.</p></div><div class="price-lock"><strong><span>$19</span> once</strong><p>Add unlimited exercise templates. The license works across devices when you paste it again.</p><a class="button primary" href="${checkoutUrl}">Buy unlimited exercises</a><a class="quiet-link" data-route href="/backup#license">Restore a license</a></div></section>
  `);
}

function legalPage(kind: 'privacy' | 'terms', demo = false): string {
  const privacy = `
    <article class="legal"><p class="eyebrow">Policy · effective 28 August 2026</p><h1>Your workout data stays on this device</h1>
    <h2>What this app stores</h2><p>Exercises, sets, notes, and settings are stored in your browser using IndexedDB. Demo data uses a separate database.</p>
    <h2>What leaves this device</h2><p>The app does not send workout data to us. Buying or checking a license contacts Sociobot with the license token.</p>
    <h2>Backups</h2><p>You choose when to download or import a backup. Encrypted backups use your password in this browser. We cannot recover that password.</p>
    <h2>Storage control</h2><p>Removing site data in your browser deletes the local log. Export a backup first if you want to keep it.</p>
    <h2>Questions</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p></article>`;
  const terms = `
    <article class="legal"><p class="eyebrow">Terms · effective 28 August 2026</p><h1>Use the log as your own record</h1>
    <h2>No training or medical advice</h2><p>The progression result follows the displayed arithmetic rule. It is not medical advice or a promise of training results.</p>
    <h2>Your responsibility</h2><p>Check each entry and choose loads you can handle safely. Stop and seek qualified help if a movement feels unsafe.</p>
    <h2>One-time license</h2><p>The $19 license adds unlimited exercise templates. Sociobot and Dodo handle payment, receipts, and refunds as merchant of record.</p>
    <h2>Availability</h2><p>The software is provided as available without warranties. Keep backups because browser storage can be cleared.</p>
    <h2>Questions</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a>.</p></article>`;
  return shell(kind === 'privacy' ? privacy : terms, demo);
}

function notFoundPage(): string {
  return shell(`<section class="not-found"><div class="lost-plate" aria-hidden="true">404</div><p class="eyebrow">Page not found</p><h1>This page does not exist</h1><p>The address may be old or mistyped.</p><a class="button primary" data-route href="/">Return home</a></section>`);
}

function latestFor(exercise: Exercise, sessions: Session[]): Session | undefined {
  return sessions.find((item) => item.exerciseId === exercise.id);
}

function loggerPage(exercises: Exercise[], sessions: Session[], demo: boolean): string {
  if (!exercises.length) {
    return shell(`<section class="app-page"><p class="eyebrow">Your workout log</p><h1>Log today’s sets</h1><div class="empty-state"><div class="empty-mark" aria-hidden="true"></div><h2>No exercises yet</h2><p>Your set rows and next-load suggestion will appear here.</p><button class="button primary" data-action="show-exercise-form">Create first exercise</button></div>${exerciseForm()}</section>`, demo);
  }
  if (!selectedExerciseId || !exercises.some((item) => item.id === selectedExerciseId)) selectedExerciseId = exercises[0].id;
  const exercise = exercises.find((item) => item.id === selectedExerciseId)!;
  const latest = latestFor(exercise, sessions);
  const startingLoad = latest?.suggestion.nextLoad ?? 0;
  const setRows = Array.from({ length: exercise.setCount }, (_, index) => `
    <fieldset class="set-row" data-set="${index}">
      <legend><span>Set ${index + 1}</span><span class="set-range">${exercise.minReps}–${exercise.maxReps} reps</span></legend>
      <div class="set-fields"><label>Load (${exercise.unit})<input data-field="load" type="number" min="0.25" step="0.25" inputmode="decimal" value="${startingLoad || ''}" required></label><label>Reps<input data-field="reps" type="number" min="1" max="99" step="1" inputmode="numeric" required></label></div>
      <div class="chips" aria-label="Set ${index + 1} rule chips">${NOTE_TAGS.map((tag) => `<label class="chip"><input data-field="tag" type="checkbox" value="${tag}"><span>${tag}</span></label>`).join('')}</div>
      <p class="chip-help">Grip slipped and Form broke hold the load.</p>
      <label class="note-field">Set detail <span>(saved only; does not change the rule)</span><input data-field="note" type="text" maxlength="120" placeholder="What else changed on this set?"></label>
    </fieldset>`).join('');
  const latestCard = latest ? `<section class="next-card ${latest.suggestion.decision}" aria-labelledby="next-title"><div><p>From ${new Date(latest.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p><h2 id="next-title">${escapeHtml(latest.suggestion.title)}</h2></div><p>${escapeHtml(latest.suggestion.reason)}</p></section>` : `<section class="next-card neutral" aria-labelledby="next-title"><div><p>First session</p><h2 id="next-title">Choose a starting load</h2></div><p>The app will use this session to make the next suggestion.</p></section>`;
  return shell(`<section class="app-page">
    <div class="app-heading"><div><p class="eyebrow">${demo ? 'Sample workout log' : 'Your workout log'}</p><h1>Log today’s sets</h1></div><button class="button secondary" data-action="show-exercise-form">Add exercise</button></div>
    <div class="exercise-switcher"><label for="exercise-select">Exercise</label><select id="exercise-select" data-action="select-exercise">${exercises.map((item) => `<option value="${item.id}" ${item.id === exercise.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}</select><span>${exercise.setCount} sets · ${exercise.minReps}–${exercise.maxReps} reps</span><div class="exercise-actions"><button class="text-button" data-action="edit-exercise" type="button">Edit exercise</button><button class="text-button danger" data-action="delete-exercise" type="button">Delete exercise</button></div></div>
    ${latestCard}
    <form id="session-form" class="session-form" novalidate>
      <div class="rule-strip"><strong>The rule</strong><span>${escapeHtml(ruleText(exercise))}</span></div>
      <div class="set-list">${setRows}</div>
      <p class="form-error" data-form-error role="alert"></p>
      <button class="button primary save-workout" type="submit">Save workout and see next load</button>
    </form>
    ${lastSuggestion ? `<section class="result-card ${lastSuggestion.decision}" tabindex="-1" data-result><p class="eyebrow">Next session</p><h2>${escapeHtml(lastSuggestion.title)}</h2><p>${escapeHtml(lastSuggestion.reason)}</p></section>` : ''}
    ${historyView(sessions, exercise.id)}
    ${exerciseForm(exercises.find((item) => item.id === editingExerciseId))}
  </section>`, demo);
}

function historyView(sessions: Session[], exerciseId: string): string {
  const items = sessions.filter((item) => item.exerciseId === exerciseId);
  if (!items.length) return `<section class="history" aria-labelledby="history-title"><h2 id="history-title">Past workouts</h2><p class="empty-copy">Saved workouts will appear here after you log every set.</p></section>`;
  return `<section class="history" aria-labelledby="history-title"><div class="history-heading"><h2 id="history-title">Past workouts</h2><span>${items.length} saved</span></div><ol>${items.map((session) => `
    <li><details><summary><span><strong>${new Date(session.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong><small>${session.sets.map((set) => `${set.reps}`).join(' / ')} reps at ${formatLoad(session.sets[0].load, session.unit)}</small></span><span class="decision-pill ${session.suggestion.decision}">${session.suggestion.decision === 'add' ? 'Add reps' : session.suggestion.decision}</span></summary>
      <div class="history-detail"><p>${escapeHtml(session.suggestion.reason)}</p><ol>${session.sets.map((set, index) => `<li><strong>Set ${index + 1}: ${set.reps} reps</strong><span>${set.tags.map(escapeHtml).join(' · ') || 'No chips'}${set.note ? ` · ${escapeHtml(set.note)}` : ''}</span></li>`).join('')}</ol><button class="text-button danger" data-action="delete-session" data-id="${session.id}">Delete this workout</button></div>
    </details></li>`).join('')}</ol></section>`;
}

function exerciseForm(exercise?: Exercise): string {
  const editing = Boolean(exercise);
  return `<dialog id="exercise-dialog" aria-labelledby="exercise-title"><form class="dialog-form" id="exercise-form"><div class="dialog-heading"><div><p class="eyebrow">Exercise template</p><h2 id="exercise-title">${editing ? 'Edit exercise' : 'Add an exercise'}</h2></div><button class="icon-button" type="button" data-action="close-exercise-form" aria-label="Close exercise form">×</button></div>
    <label>Exercise name<input name="name" required maxlength="60" autocomplete="off" value="${escapeHtml(exercise?.name ?? '')}"></label>
    <div class="form-grid"><label>Minimum reps<input name="minReps" type="number" min="1" max="50" value="${exercise?.minReps ?? 8}" required></label><label>Maximum reps<input name="maxReps" type="number" min="2" max="50" value="${exercise?.maxReps ?? 12}" required></label></div>
    <div class="form-grid"><label>Working sets<input name="setCount" type="number" min="1" max="10" value="${exercise?.setCount ?? 3}" required></label><label>Load increase<input name="increment" type="number" min="0.25" max="100" step="0.25" value="${exercise?.increment ?? 2.5}" required></label></div>
    <label>Unit<select name="unit"><option value="kg" ${exercise?.unit !== 'lb' ? 'selected' : ''}>Kilograms</option><option value="lb" ${exercise?.unit === 'lb' ? 'selected' : ''}>Pounds</option></select></label>
    <p class="form-error" data-exercise-error role="alert"></p><button class="button primary" type="submit">${editing ? 'Save changes' : 'Save exercise'}</button>
  </form></dialog>`;
}

function backupPage(demo: boolean): string {
  const paid = hasPaidAccess(demo);
  return shell(`<section class="settings-page"><p class="eyebrow">Data control</p><h1>Back up your workout log</h1><p class="lede">Download a copy before clearing browser data or moving devices.</p>
    <section aria-labelledby="export-title"><h2 id="export-title">Export</h2><div class="action-list"><div><h3>Spreadsheet copy</h3><p>Download every saved set as a CSV file.</p><button class="button secondary" data-action="export-csv">Export CSV</button></div><div><h3>Encrypted backup</h3><p>Protect the full log with a password that never leaves this browser.</p><form data-action="encrypted-export"><label>Backup password<input name="password" type="password" minlength="8" required autocomplete="new-password"></label><button class="button secondary" type="submit">Download encrypted backup</button></form></div></div></section>
    <section aria-labelledby="import-title"><h2 id="import-title">Import</h2><p>Imported exercises and workouts are added to this ${demo ? 'demo' : 'log'}.</p><form class="import-form" data-action="import-backup"><label>Backup file<input name="file" type="file" accept="application/json,.json" required></label><label>Password <span>(only for encrypted files)</span><input name="password" type="password" autocomplete="current-password"></label><button class="button secondary" type="submit">Import backup</button></form></section>
    <section id="license" aria-labelledby="license-title"><h2 id="license-title">Unlimited exercise license</h2>${paid ? `<div class="license-active"><strong>Unlimited exercises are active.</strong><button class="text-button danger" data-action="remove-license">Remove license from this device</button></div>` : `<p>Keep up to three exercises free. Pay $19 once to add unlimited exercise templates.</p><a class="button primary" href="${checkoutUrl}">Buy unlimited exercises</a><form class="license-form" data-action="restore-license"><label>Have a license? Paste it here<input name="license" type="text" required autocomplete="off"></label><button class="button secondary" type="submit">Verify license</button></form>`}</section>
  </section>`, demo);
}

async function render(pushFocus = false): Promise<void> {
  const route = path();
  const demo = isDemo();
  if (demo) await ensureDemoSeeded();
  document.title = routeTitle(route);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = `https://set-note-progression.sociobot.in${route === '/404' ? '/' : route}`;
  let html: string;
  if (route === '/') html = homePage();
  else if (route === '/privacy' || route === '/terms') html = legalPage(route.slice(1) as 'privacy' | 'terms', demo);
  else if (route === '/404') html = notFoundPage();
  else if (route === '/log' || route === '/demo') {
    html = loggerPage(await listExercises(demo), await listSessions(demo), demo);
  } else if (route === '/backup') html = backupPage(isDemo());
  else html = notFoundPage();
  app.innerHTML = html;
  bindPage();
  updateNetwork();
  if (notice) { showToast(notice); notice = ''; }
  if (pushFocus) {
    const heading = app.querySelector<HTMLElement>('h1');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus();
    app.querySelector<HTMLElement>('.route-announcer')!.textContent = document.title;
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
}

async function navigate(url: string): Promise<void> {
  const target = new URL(url, location.href);
  const targetIsDemo = target.pathname.replace(/\/+$/, '') === '/demo' || target.searchParams.get('demo') === '1';
  const leavingDemo = isDemo() && !targetIsDemo;
  await prepareDemoNamespace(targetIsDemo);
  if (leavingDemo) {
    selectedExerciseId = '';
    editingExerciseId = '';
  }
  history.pushState({}, '', url);
  lastSuggestion = null;
  await render(true);
}

function bindPage(): void {
  app.querySelectorAll<HTMLAnchorElement>('a[data-route]').forEach((link) => link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); void navigate(link.pathname + link.search + link.hash);
  }));
  app.querySelector('[data-action="show-exercise-form"]')?.addEventListener('click', () => void openExerciseDialog());
  app.querySelector('[data-action="edit-exercise"]')?.addEventListener('click', () => void openExerciseDialog(selectedExerciseId));
  app.querySelector('[data-action="close-exercise-form"]')?.addEventListener('click', () => {
    app.querySelector<HTMLDialogElement>('#exercise-dialog')?.close();
    editingExerciseId = '';
  });
  app.querySelector<HTMLSelectElement>('[data-action="select-exercise"]')?.addEventListener('change', (event) => {
    selectedExerciseId = (event.currentTarget as HTMLSelectElement).value; lastSuggestion = null; void render();
  });
  app.querySelector<HTMLFormElement>('#session-form')?.addEventListener('submit', handleSessionSubmit);
  app.querySelector<HTMLFormElement>('#exercise-form')?.addEventListener('submit', handleExerciseSubmit);
  app.querySelectorAll<HTMLButtonElement>('[data-action="delete-session"]').forEach((button) => button.addEventListener('click', () => void handleDelete(button.dataset.id!)));
  app.querySelector('[data-action="delete-exercise"]')?.addEventListener('click', () => void handleDeleteExercise());
  app.querySelector('[data-action="reset-demo"]')?.addEventListener('click', async () => { await resetDemo(); clearDemoLicense(); notice = 'Demo reset to its original sample.'; await render(); });
  app.querySelector('[data-action="export-csv"]')?.addEventListener('click', () => void exportCsv());
  app.querySelector<HTMLFormElement>('form[data-action="encrypted-export"]')?.addEventListener('submit', handleEncryptedExport);
  app.querySelector<HTMLFormElement>('form[data-action="import-backup"]')?.addEventListener('submit', handleImport);
  app.querySelector<HTMLFormElement>('form[data-action="restore-license"]')?.addEventListener('submit', handleRestoreLicense);
  app.querySelector('[data-action="remove-license"]')?.addEventListener('click', () => { removeLicense(isDemo()); notice = 'License removed from this device.'; void render(); });
}

async function openExerciseDialog(id = ''): Promise<void> {
  editingExerciseId = id;
  await render();
  const dialog = app.querySelector<HTMLDialogElement>('#exercise-dialog');
  dialog?.showModal();
  dialog?.querySelector<HTMLInputElement>('[name="name"]')?.focus();
}

async function handleExerciseSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const nameInput = form.elements.namedItem('name') as HTMLInputElement;
  const name = String(values.get('name')).trim();
  const minReps = Number(values.get('minReps'));
  const maxReps = Number(values.get('maxReps'));
  const error = form.querySelector<HTMLElement>('[data-exercise-error]')!;
  if (!name) {
    error.textContent = 'Enter an exercise name with at least one visible character.';
    nameInput.focus();
    return;
  }
  if (maxReps <= minReps) { error.textContent = 'Maximum reps must be higher than minimum reps. Change the rep range.'; return; }
  const exercises = await listExercises(isDemo());
  const existing = exercises.find((item) => item.id === editingExerciseId);
  if (!existing && exercises.length >= 3 && !hasPaidAccess(isDemo())) {
    error.innerHTML = `The free log holds three exercises. <a data-route href="/backup#license">Buy or restore unlimited exercises.</a>`;
    return;
  }
  const exercise: Exercise = {
    id: existing?.id ?? crypto.randomUUID(), name, minReps, maxReps,
    setCount: Number(values.get('setCount')), increment: Number(values.get('increment')),
    unit: values.get('unit') === 'lb' ? 'lb' : 'kg', createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  await saveExercise(isDemo(), exercise);
  selectedExerciseId = exercise.id;
  notice = existing ? `${exercise.name} was updated.` : `${exercise.name} was added.`;
  editingExerciseId = '';
  await render();
}

async function handleSessionSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const exercises = await listExercises(isDemo());
  const exercise = exercises.find((item) => item.id === selectedExerciseId);
  if (!exercise) return;
  const error = form.querySelector<HTMLElement>('[data-form-error]')!;
  if (!form.checkValidity()) {
    const invalid = form.querySelector<HTMLInputElement>('input:invalid');
    error.textContent = invalid?.dataset.field === 'reps'
      ? 'Reps must be a whole number from 1 to 99. Correct the marked set.'
      : 'Every set needs a load above zero. Correct the marked set.';
    invalid?.focus();
    invalid?.reportValidity();
    return;
  }
  const sets: LoggedSet[] = Array.from(form.querySelectorAll<HTMLElement>('[data-set]')).map((row) => ({
    load: Number(row.querySelector<HTMLInputElement>('[data-field="load"]')?.value),
    reps: Number(row.querySelector<HTMLInputElement>('[data-field="reps"]')?.value),
    tags: Array.from(row.querySelectorAll<HTMLInputElement>('[data-field="tag"]:checked')).map((item) => item.value),
    note: row.querySelector<HTMLInputElement>('[data-field="note"]')?.value.trim() ?? '',
  }));
  if (sets.some((set) => !Number.isFinite(set.load) || set.load <= 0 || !Number.isInteger(set.reps) || set.reps <= 0 || set.reps > 99)) {
    error.textContent = 'Every set needs a load above zero and a whole rep count from 1 to 99.';
    form.querySelector<HTMLInputElement>(':invalid, input[value=""]')?.focus(); return;
  }
  if (new Set(sets.map((set) => set.load)).size > 1) {
    error.textContent = 'Use one working load for this rule. Make every set load match.'; return;
  }
  const suggestion = nextSuggestion(exercise, sets);
  await saveSession(isDemo(), {
    id: crypto.randomUUID(), exerciseId: exercise.id, exerciseName: exercise.name,
    completedAt: new Date().toISOString(), minReps: exercise.minReps, maxReps: exercise.maxReps,
    increment: exercise.increment, unit: exercise.unit, sets, suggestion,
  });
  lastSuggestion = suggestion;
  notice = 'Workout saved in this browser.';
  await render();
  app.querySelector<HTMLElement>('[data-result]')?.focus();
}

async function handleDelete(id: string): Promise<void> {
  if (!confirm('Delete this workout? This cannot be undone.')) return;
  await deleteSession(isDemo(), id); notice = 'Workout deleted.'; await render();
}

async function handleDeleteExercise(): Promise<void> {
  const exercise = (await listExercises(isDemo())).find((item) => item.id === selectedExerciseId);
  if (!exercise) return;
  if (!confirm(`Delete ${exercise.name} and all of its saved workouts? This cannot be undone.`)) return;
  await deleteExercise(isDemo(), exercise.id);
  selectedExerciseId = '';
  editingExerciseId = '';
  lastSuggestion = null;
  notice = `${exercise.name} and its workouts were deleted.`;
  await render();
}

function download(name: string, type: string, data: string): void {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function exportCsv(): Promise<void> {
  const sessions = await listSessions(isDemo());
  const lines = ['date,exercise,set,load,unit,reps,tags,note,next_action,next_load'];
  const cell = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  sessions.slice().reverse().forEach((session) => session.sets.forEach((set, index) => lines.push([
    session.completedAt, session.exerciseName, index + 1, set.load, session.unit, set.reps,
    set.tags.join('; '), set.note, session.suggestion.decision, session.suggestion.nextLoad,
  ].map(cell).join(','))));
  download('set-note-progression.csv', 'text/csv;charset=utf-8', `${lines.join('\n')}\n`);
  showToast(`${sessions.length} workouts exported as CSV.`);
}

async function handleEncryptedExport(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  if (!form.reportValidity()) return;
  try {
    const password = String(new FormData(form).get('password'));
    const encrypted = await encryptBackup(await makeBackup(isDemo()), password);
    download('set-note-progression-backup.json', 'application/json', JSON.stringify(encrypted, null, 2));
    form.reset(); showToast('Encrypted backup downloaded. Keep its password safe.');
  } catch (error) { showToast(error instanceof Error ? error.message : 'The backup could not be created. Try again.', true); }
}

async function handleImport(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  if (!form.reportValidity()) return;
  try {
    const values = new FormData(form); const file = values.get('file') as File;
    const parsed = JSON.parse(await file.text()) as Backup | EncryptedBackup;
    const backup = parsed.format === 'set-note-progression-encrypted'
      ? await decryptBackup(parsed as EncryptedBackup, String(values.get('password')))
      : parsed as Backup;
    await restoreBackup(isDemo(), backup); form.reset(); notice = 'Backup imported into this browser.'; await render();
  } catch (error) { showToast(error instanceof Error ? error.message : 'The backup could not be imported. Check the file.', true); }
}

async function handleRestoreLicense(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const token = String(new FormData(form).get('license')).trim();
  if (!token) return;
  const demo = isDemo();
  saveLicense(token, demo);
  const verdict = await verifyLicense(true, demo);
  if (verdict?.valid) { notice = 'Unlimited exercises are active on this device.'; await render(); }
  else { removeLicense(demo); showToast('That license is not active. Check the token and try again.', true); }
}

function showToast(message: string, error = false): void {
  const toast = app.querySelector<HTMLElement>('[data-toast]');
  if (!toast) return;
  toast.textContent = message; toast.classList.toggle('error', error); toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}

function updateNetwork(): void {
  app.querySelectorAll<HTMLElement>('[data-network]').forEach((item) => {
    item.textContent = navigator.onLine ? 'Online' : 'Offline · changes stay here';
    item.classList.toggle('offline', !navigator.onLine);
  });
}

async function prepareDemoNamespace(demo: boolean): Promise<void> {
  const active = Boolean(sessionStorage.getItem(DEMO_SESSION_KEY));
  if (demo && !active) {
    await resetDemo();
    clearDemoLicense();
    sessionStorage.setItem(DEMO_SESSION_KEY, '1');
  } else if (!demo && active) {
    await resetDemo();
    clearDemoLicense();
    sessionStorage.removeItem(DEMO_SESSION_KEY);
  }
}

export async function startApp(): Promise<void> {
  const initialUrl = new URL(location.href);
  if (path() === '/' && initialUrl.searchParams.get('demo') === '1') {
    initialUrl.pathname = '/demo';
    initialUrl.searchParams.delete('demo');
    history.replaceState({}, '', `${initialUrl.pathname}${initialUrl.search}${initialUrl.hash}`);
  }
  const demo = isDemo();
  await prepareDemoNamespace(demo);
  const captured = captureLicense(demo);
  if (captured) notice = 'License saved. Checking it now.';
  addEventListener('popstate', () => void prepareDemoNamespace(isDemo()).then(() => render(true)));
  addEventListener('online', updateNetwork); addEventListener('offline', updateNetwork);
  await render();
  void verifyLicense(false, demo).then((verdict) => {
    if (verdict && !verdict.valid) { showToast('The saved license is no longer active.', true); }
  });
}

export function notifyUpdate(registration: ServiceWorkerRegistration): void {
  const toast = app.querySelector<HTMLElement>('[data-toast]');
  if (!toast || !registration.waiting) return;
  toast.innerHTML = 'An update is ready. <button class="text-button" data-update>Use it now</button>';
  toast.classList.add('show');
  toast.querySelector('button')?.addEventListener('click', () => registration.waiting?.postMessage('SKIP_WAITING'));
}
