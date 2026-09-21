#!/usr/bin/env node
/**
 * Fetch a public Google Sheet and regenerate src/lib/data/members.ts.
 *
 * Expected sheet columns (header row, order does not matter):
 *   Name (required), PFP, Bio,
 *   and any of: Twitch, X / Twitter, Discord, YouTube, TikTok, Instagram, Bluesky
 *
 * Cell conventions:
 *   - Social cells: a full URL (https://...) or a bare handle/URL without scheme.
 *   - PFP cell: a full image URL (Google Drive share links are rewritten to the
 *     direct image endpoint at 256px width), or a bare file name that is resolved against the
 *     /pfp/ folder in public/ (e.g. "mewmi.png" → "pfp/mewmi.png").
 *
 * Usage:
 *   SHEET_URL="https://docs.google.com/spreadsheets/d/<ID>/edit" node .github/scripts/update-members.mjs
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const outPath = path.join(root, 'src', 'lib', 'data', 'members.ts');

// ---------------------------------------------------------------- sheet URL
const sheetUrl = (process.env.SHEET_URL || '').trim();
const idMatch = sheetUrl.match(/spreadsheets\/d\/([A-Za-z0-9_-]+)/);
if (!idMatch) {
  console.error('✖ SHEET_URL is missing or does not look like a Google Sheet URL.');
  console.error('  Example: https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit');
  process.exit(1);
}
const sheetId = idMatch[1];

// ------------------------------------------------------------------ fetch
console.log(`Fetching sheet ${sheetId} ...`);
const res = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`, {
  headers: { 'user-agent': 'teameternalwind-members-sync' },
});
if (!res.ok) {
  console.error(`✖ Could not fetch the sheet (HTTP ${res.status} ${res.statusText}).`);
  console.error('  Make sure it is shared as "Anyone with the link → Viewer".');
  process.exit(1);
}
const csv = (await res.text()).replace(/^\uFEFF/, '');
if (!csv.trim()) {
  console.error('✖ The sheet returned no data.');
  process.exit(1);
}

// ------------------------------------------------- CSV parsing (RFC 4180)
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

const rows = parseCsv(csv);
if (rows.length < 2) {
  console.error('✖ The sheet only has a header row — no member rows found.');
  process.exit(1);
}
const header = rows[0].map((h) => h.trim().toLowerCase());

// -------------------------------------------------------- column mapping
const NAME_HEADERS = ['name', 'member', 'handle'];
const PFP_HEADERS = ['pfp', 'profile pic', 'profile picture', 'avatar', 'photo'];
const BIO_HEADERS = ['bio', 'about', 'short bio'];
const SOCIAL_HEADERS = {
  twitch: 'twitch',
  x: 'x',
  twitter: 'x',
  discord: 'discord',
  youtube: 'youtube',
  tiktok: 'tiktok',
  instagram: 'instagram',
  bluesky: 'bluesky',
};

const nameIdx = header.findIndex((h) => NAME_HEADERS.includes(h));
if (nameIdx === -1) {
  console.error(`✖ No "Name" column found. Columns in the sheet: ${header.join(', ')}`);
  process.exit(1);
}
const pfpIdx = header.findIndex((h) => PFP_HEADERS.includes(h));
const bioIdx = header.findIndex((h) => BIO_HEADERS.includes(h));
const socialIdx = {};
header.forEach((h, i) => {
  if (SOCIAL_HEADERS[h] && socialIdx[SOCIAL_HEADERS[h]] === undefined) {
    socialIdx[SOCIAL_HEADERS[h]] = i;
  }
});

const usedIdx = new Set([nameIdx, pfpIdx, bioIdx, ...Object.values(socialIdx)].filter((i) => i !== -1));
const unknown = header
  .map((h, i) => ({ h, i }))
  .filter(({ h, i }) => h !== '' && !usedIdx.has(i));
if (unknown.length > 0) {
  console.log(`ℹ Ignoring unrecognized columns: ${unknown.map((u) => u.h).join(', ')}`);
}

console.log(`Sheet columns : ${header.filter(Boolean).join(' | ')}`);
console.log(`Member rows   : ${rows.length - 1}`);

// ---------------------------------------------------------------- helpers
function slug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function tsString(s) {
  s = s.replace(/\r\n?/g, '\n').trim();
  return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
}

function normSocial(cell) {
  let url = (cell || '').trim();
  if (!url) return '';
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(url) && !url.startsWith('//')) {
    url = 'https://' + url;
  }
  return url;
}

function normAvatar(cell) {
  const v = (cell || '').trim();
  if (!v) return '';
  // Google Drive share links ("…/file/d/<id>/view?usp=drive_link") serve an HTML
  // page, not image bytes, so <img src> would show a broken image. Rewrite any
  // Drive link form to the direct image endpoint instead. Drive files must be
  // shared as "Anyone with the link → Viewer".
  const drive = v.match(
    /drive\.google\.com\/(?:file\/d\/([A-Za-z0-9_-]+)\/view|uc\?(?:export=(?:view|download)&)?id=([A-Za-z0-9_-]+))/,
  );
  // =w256 keeps avatars ~2x display size (112px) so they load fast.
  if (drive) return `https://lh3.googleusercontent.com/d/${drive[1] || drive[2]}=w256`;
  if (/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(v)) return v; // full URL → keep as-is
  return 'pfp/' + v.replace(/^\.?\/+/, ''); // bare file → /pfp/<file>
}

// Accent colors: keep the palette the site already uses. Known members keep
// their established color; new members get a stable, deterministic one.
const ACCENT_PALETTE = ['#e879f9', '#fbbf24', '#4ade80', '#60a5fa', '#f472b6', '#fb7185', '#fb923c', '#2dd4bf'];
const KNOWN_ACCENTS = {
  mewsicalmiqo: '#e879f9',
  tayetales: '#fbbf24',
  fizzygames: '#4ade80',
  rinnibun: '#60a5fa',
  dreamyetude: '#f472b6',
  'projekt auran': '#fb7185',
  onmyoujin: '#fb923c',
  ahrieffect: '#2dd4bf',
};

function accentFor(name) {
  const key = name.toLowerCase().trim();
  if (KNOWN_ACCENTS[key]) return KNOWN_ACCENTS[key];
  let h = 5381;
  for (let i = 0; i < key.length; i++) h = ((h << 5) + h + key.charCodeAt(i)) >>> 0;
  return ACCENT_PALETTE[h % ACCENT_PALETTE.length];
}

// ------------------------------------------------------------------- build
const members = [];
for (const r of rows.slice(1)) {
  const name = (r[nameIdx] || '').trim();
  if (!name) continue;

  // Preserve the sheet's column order for the social links.
  const socials = [];
  for (const [key, idx] of Object.entries(socialIdx)) {
    const url = r[idx] !== undefined ? normSocial(r[idx]) : '';
    if (url) socials.push({ key, url });
  }

  members.push({
    name,
    avatar: pfpIdx !== -1 ? normAvatar(r[pfpIdx]) : '',
    bio: bioIdx !== -1 ? (r[bioIdx] || '').trim() : '',
    socials,
  });
}
if (members.length === 0) {
  console.error('✖ No usable member rows (every row is missing a Name).');
  process.exit(1);
}

// ------------------------------------------------------------- emit TS file
const SOCIAL_KEYS = [...new Set(Object.values(SOCIAL_HEADERS))];
let out = '';
out += `// ⚠️ GENERATED FILE — do not edit by hand.\n`;
out += `// Source: Google Sheet (see .github/workflows/update-members.yml, run manually).\n`;
out += `// Regenerate: run the "Update Members from Sheet" workflow.\n`;
out += `\n`;
out += `export type SocialKey = ${SOCIAL_KEYS.map((k) => `'${k}'`).join(' | ')};\n`;
out += `\n`;
out += `export interface SocialLink {\n\tkey: SocialKey;\n\turl: string;\n}\n`;
out += `\n`;
out += `export interface Member {\n\tid: string;\n\tname: string;\n\tbio: string;\n\tavatar?: string;\n\taccent: string;\n\tsocials: SocialLink[];\n}\n`;
out += `\n`;
out += `export const members: Member[] = [\n`;
for (const m of members) {
  out += `\t{\n`;
  out += `\t\tid: ${tsString(slug(m.name))},\n`;
  out += `\t\tname: ${tsString(m.name)},\n`;
  out += `\t\tbio: ${tsString(m.bio)},\n`;
  if (m.avatar) out += `\t\tavatar: ${tsString(m.avatar)},\n`;
  out += `\t\taccent: ${tsString(accentFor(m.name))},\n`;
  out += `\t\tsocials: [\n`;
  for (const s of m.socials) {
    out += `\t\t\t{ key: '${s.key}', url: ${tsString(s.url)} },\n`;
  }
  out += `\t\t],\n`;
  out += `\t},\n`;
}
out += `];\n`;

writeFileSync(outPath, out);
console.log(`✔ Wrote ${path.relative(root, outPath)} (${members.length} members)`);
console.log(`  ${members.map((m) => m.name).join(', ')}`);
