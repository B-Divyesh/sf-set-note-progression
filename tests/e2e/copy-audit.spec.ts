import { expect, test } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';

const bannedWords = ['leverage', 'seamless', 'effortless', 'robust', 'powerful', 'intuitive', 'reimagine', 'supercharge', 'delightful', 'journey', 'ecosystem', 'ai-powered'];

function sentences(lines: string[]): string[] {
  return [...new Set(lines.flatMap((line) => line
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean)))];
}

function auditTable(items: string[]): { markdown: string; flags: string[] } {
  const flags: string[] = [];
  const rows = items.map((copy) => {
    const words = copy.split(/\s+/).filter(Boolean).length;
    const found = bannedWords.filter((word) => copy.toLowerCase().includes(word));
    const rowFlags = [...(words > 22 ? ['over 22 words'] : []), ...found.map((word) => `banned: ${word}`)];
    flags.push(...rowFlags.map((flag) => `${copy}: ${flag}`));
    return `| ${copy.replaceAll('|', '\\|')} | ${words} | ${rowFlags.join(', ') || '—'} |`;
  });
  return { markdown: ['| Copy | Words | Flag |', '| --- | ---: | --- |', ...rows].join('\n'), flags };
}

function readmeSentences(readme: string): string[] {
  let inCode = false;
  const lines: string[] = [];
  for (const sourceLine of readme.split('\n')) {
    if (sourceLine.trim().startsWith('```')) { inCode = !inCode; continue; }
    if (inCode || !sourceLine.trim()) continue;
    const line = sourceLine
      .replace(/^#{1,6}\s+/, '')
      .replace(/^[-*]\s+/, '')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 $2')
      .replaceAll('`', '')
      .replaceAll('**', '')
      .trim();
    if (line) lines.push(line);
  }
  return sentences(lines);
}

test('checked-in copy audit matches rendered landing copy and README', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'One deterministic rendered-copy audit is sufficient.');
  await page.goto('/');
  const rendered = await page.evaluate(() => {
    const visibleLines = document.body.innerText.split('\n');
    const accessible = Array.from(document.querySelectorAll<HTMLElement>('[aria-label], a, button'))
      .flatMap((element) => [element.getAttribute('aria-label') ?? '', element.innerText]);
    const alternatives = Array.from(document.images).map((image) => image.alt).filter(Boolean);
    return [...visibleLines, ...accessible, ...alternatives];
  });
  const landing = auditTable(sentences(rendered));
  const readme = auditTable(readmeSentences(readFileSync('README.md', 'utf8')));
  expect([...landing.flags, ...readme.flags], 'copy must stay under 23 words and avoid banned terms').toEqual([]);
  const output = `# Copy audit\n\nGenerated from the rendered landing page and README by \`npm run copy:audit\`. `
    + `The counting rule is whitespace-separated tokens after collapsing repeated spaces. `
    + `Code blocks are excluded; headings, controls, accessible labels, image alternatives, and prose are included.\n\n`
    + `## Rendered landing page\n\n${landing.markdown}\n\n`
    + `## README\n\n${readme.markdown}\n\n`
    + `## Terminology\n\n| Concept | One term |\n| --- | --- |\n`
    + `| One movement setup | exercise |\n| A completed group of reps | set |\n| The lower and upper target | rep range |\n`
    + `| Saved context that does not affect the rule | set detail |\n| A choice that affects the rule | rule chip |\n`
    + `| The computed outcome | next load |\n| Temporary sample workspace | demo |\n| Downloaded data copy | backup |\n| Paid entitlement | license |\n`;
  if (process.env.UPDATE_COPY_AUDIT === '1') writeFileSync('.factory/copy-audit.md', output);
  expect(readFileSync('.factory/copy-audit.md', 'utf8')).toBe(output);
});
