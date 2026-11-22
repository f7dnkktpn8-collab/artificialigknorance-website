#!/usr/bin/env node
// App Store pictures watcher.
//
// For every Artificial Igknorance app this asks Apple (the public iTunes Lookup
// service) for the current iPhone pictures and the app icon, and compares them
// with the list saved in images-seen.json. Apple gives a picture a new web
// address whenever it is replaced, so a changed address means a changed picture.
//
// Usage:
//   node scripts/appstore/check-images.mjs                 # report only
//   node scripts/appstore/check-images.mjs --apply         # also replace changed pictures
//   node scripts/appstore/check-images.mjs --accept gold-watcher   # mark an app as handled
//   node scripts/appstore/check-images.mjs --init          # save today's addresses as the baseline
//
// --apply swaps a picture ONLY when it sits in a slot the website already
// shows, nobody edited it by hand, and the number of pictures is unchanged.
// Everything else (more or fewer pictures, a skipped or hand-edited picture
// that changed) is reported as NEEDS A LOOK. Changed pictures are always
// downloaded to the folder printed at the top so they can be viewed first.
//
// Where the website uses each picture lives in the APPS list below.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const SEEN = join(__dirname, 'images-seen.json');
const LOOK_DIR = join(tmpdir(), 'appstore-images');

// A slot is a website file name (no extension), or an object:
//   { skip: 'why' }                 the site leaves this picture out on purpose
//   { file: 'name', hold: 'why' }   the site shows it but it was edited by hand
// Slot 1 of the list is the first App Store picture, and so on.
const APPS = {
  'escalator-field-command': { id: '6756789866', cc: 'us', dir: 'escalator', icon: 'escalator-field-command',
    slots: ['field-guide', 'completion-metrics', 'no-guessing', 'code-questions', 'all-units', 'hours', 'unit-details', 'cat1-testing'] },
  'healthtrail-medical': { id: '6758072258', cc: 'us', dir: 'healthtrail', icon: 'healthtrail-medical',
    slots: [{ skip: 'cover poster; repeats the page header and would leave one picture alone in the last row' },
      'timeline', 'metrics', 'trends', 'medications', 'family', 'allergies', 'insurance', 'scan', 'private'] },
  'clock-in-everyday': { id: '6791800212', cc: 'us', dir: 'clock-in-everyday', icon: 'clock-in-everyday',
    slots: [{ skip: 'cover poster; repeats the page header and would leave one picture alone in the last row' },
      'dashboard', 'workout-today', 'gym-machines', 'progress', 'voice-log', 'supplements'] },
  'snapledger': { id: '6759497982', cc: 'ca', dir: 'snapledger', icon: 'snapledger',
    slots: ['bills-overview', 'subscriptions', 'bill-detail', 'trends', 'bills-list', 'subs-watched'] },
  'copper-watcher': { id: '6757655923', cc: 'us', dir: 'copper-watcher', icon: 'copper-watcher',
    slots: ['spot-price', 'signals', 'alerts', 'portfolio', 'what-if', 'light-dark'] },
  'gold-watcher': { id: '6758283387', cc: 'us', dir: 'gold-watcher', icon: 'gold-watcher',
    slots: ['spot-price', 'signals', 'alerts', 'portfolio', 'compare-spy', 'light-dark'] },
  'silver-watcher': { id: '6760270695', cc: 'us', dir: 'silver-watcher', icon: 'silver-watcher',
    slots: ['spot-price', 'signals', 'alerts', 'portfolio', 'what-if', 'light-dark'] },
  'lithium-watcher': { id: '6761344726', cc: 'us', dir: 'lithium-watcher', icon: 'lithium-watcher',
    slots: ['markets', 'signals', 'alerts', 'portfolio', 'ev-compare', 'light-dark'] },
  'ridgepacker': { id: '6766699306', cc: 'us', dir: 'ridgepacker', icon: 'ridgepacker',
    slots: ['all-your-gear', 'pack-with-a-plan', 'know-what-you-carry', 'sublists', 'everyday-carry', 'export-pdf'] },
  'family-lists': { id: '6813696329', cc: 'us', dir: 'family-lists', icon: 'family-lists',
    slots: [{ skip: 'collage cover; repeats the page header and would leave one picture alone in the last row' },
      'groceries', 'gifts', 'wish-list', 'hosting-guests', 'hosting-menu', 'hosting-supplies'] },
  'junkyard-titans': { id: '6826464717', cc: 'us', dir: 'junkyard-titans', icon: 'junkyard-titans',
    slots: [{ skip: 'collage cover; repeats the page header and would leave one picture alone in the last row' },
      'crusher', 'trading', 'binder', 'crates', 'arena', 'robots', 'market', 'warehouse', 'garage'] },
};

// Homepage tiles that reuse an App Store picture: tile file -> [app, slot number]
const TILES = {
  'health-timeline': ['healthtrail-medical', 2],
  'health-meds': ['healthtrail-medical', 5],
  'ridge-trips': ['ridgepacker', 2],
  'ridge-catalog': ['ridgepacker', 1],
  'snap-overview': ['snapledger', 1],
  'snap-subs': ['snapledger', 6],
  'clock-poster-1': ['clock-in-everyday', 2],
  'clock-poster-2': ['clock-in-everyday', 5],
  'fl-poster-groceries': ['family-lists', 2],
  'fl-poster-gifts': ['family-lists', 3],
  'jt-crusher': ['junkyard-titans', 2],
  'jt-arena': ['junkyard-titans', 6],
};

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const INIT = args.includes('--init');
const ACCEPT = args.includes('--accept') ? args.slice(args.indexOf('--accept') + 1).filter((a) => !a.startsWith('--')) : null;

// "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource.../x.png/392x696bb.png" -> "PurpleSource.../x.png"
const baseOf = (u) => u.replace(/^https:\/\/[^/]+\/image\/thumb\//, '').replace(/\/[^/]+$/, '');
const hostOf = (u) => u.match(/^https:\/\/[^/]+/)[0];
const sizeless = (u, size) => u.replace(/\/[^/]+$/, `/${size}`);

async function getJson(url, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      if (i >= tries) throw e;
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
}
async function getBuf(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return Buffer.from(await r.arrayBuffer());
}

async function writePicture(buf, base, w, h) {
  const img = sharp(buf).resize(w, h, { fit: 'fill' });
  await img.clone().jpeg({ quality: 85, progressive: true, mozjpeg: true }).toFile(`${base}.jpg`);
  await img.clone().webp({ quality: 80 }).toFile(`${base}.webp`);
}

const seen = (() => { try { return JSON.parse(readFileSync(SEEN, 'utf8')); } catch { return {}; } })();
const next = JSON.parse(JSON.stringify(seen));
mkdirSync(LOOK_DIR, { recursive: true });

let replaced = 0, needsLook = 0;
const out = [];
const say = (s = '') => out.push(s);

for (const [key, app] of Object.entries(APPS)) {
  let r;
  try {
    const d = await getJson(`https://itunes.apple.com/lookup?id=${app.id}&country=${app.cc}&t=${Date.now()}`);
    r = d.results?.[0];
    if (!r) throw new Error('no result');
  } catch (e) {
    say(`${key}: COULD NOT CHECK (${e.message})`);
    needsLook++;
    continue;
  }
  const urls = r.screenshotUrls ?? [];
  const bases = urls.map(baseOf);
  const iconUrl = r.artworkUrl512;
  const iconBase = iconUrl ? baseOf(iconUrl) : null;
  const was = seen[key];

  if (INIT || !was) {
    next[key] = { pictures: bases, icon: iconBase };
    say(`${key}: saved ${bases.length} picture address(es) as the baseline`);
    continue;
  }
  if (ACCEPT) {
    if (ACCEPT.includes(key)) { next[key] = { pictures: bases, icon: iconBase }; say(`${key}: marked as handled`); }
    continue;
  }

  const problems = [];
  const done = [];
  let manifestOk = true;

  // pictures
  if (bases.length !== was.pictures.length) {
    problems.push(`picture count changed: ${was.pictures.length} -> ${bases.length}. Add or remove figures on the page (captions, alt text, grid rows, search data), then run --accept ${key}`);
    manifestOk = false;
    // still download the new ones to look at
    for (let i = 0; i < bases.length; i++) {
      if (bases[i] !== was.pictures[i]) {
        try { writeFileSync(join(LOOK_DIR, `${key}-${String(i + 1).padStart(2, '0')}.png`), await getBuf(sizeless(urls[i], '1290x0w.png'))); } catch {}
      }
    }
  } else {
    for (let i = 0; i < bases.length; i++) {
      if (bases[i] === was.pictures[i]) continue;
      const n = i + 1;
      const slot = app.slots[i];
      const png = join(LOOK_DIR, `${key}-${String(n).padStart(2, '0')}.png`);
      let buf;
      try { buf = await getBuf(sizeless(urls[i], '1290x0w.png')); writeFileSync(png, buf); }
      catch (e) { problems.push(`picture ${n}: changed but could not download (${e.message})`); manifestOk = false; continue; }

      if (slot === undefined) {
        problems.push(`picture ${n}: changed and the site has no slot for it. Downloaded to ${png}`);
        manifestOk = false;
      } else if (typeof slot === 'object' && slot.skip) {
        problems.push(`picture ${n} (left off the site: ${slot.skip}) changed. Look at ${png}; add it to the page only if the problem is gone`);
        manifestOk = false;
      } else if (typeof slot === 'object' && slot.hold) {
        problems.push(`picture ${n} (${slot.file}: ${slot.hold}) changed. Look at ${png}`);
        manifestOk = false;
      } else if (APPLY) {
        await writePicture(buf, join(ROOT, 'public/images/screenshots', app.dir, slot), 800, 1738);
        done.push(`picture ${n} -> screenshots/${app.dir}/${slot}.jpg/.webp`);
        for (const [tile, [tApp, tSlot]] of Object.entries(TILES)) {
          if (tApp === key && tSlot === n) {
            await writePicture(buf, join(ROOT, 'public/images/home', tile), 640, 1391);
            done.push(`  and homepage tile home/${tile}`);
          }
        }
        replaced++;
      } else {
        problems.push(`picture ${n} (${slot}) changed. Downloaded to ${png}. Run with --apply to swap it in`);
        manifestOk = false;
      }
    }
  }

  // icon
  if (iconBase && iconBase !== was.icon) {
    const icon = join(ROOT, 'public/images', `${app.icon}-icon.webp`);
    if (APPLY) {
      await sharp(await getBuf(sizeless(iconUrl, '512x512bb.png'))).resize(512, 512).webp({ quality: 85 }).toFile(icon);
      done.push(`icon -> images/${app.icon}-icon.webp`);
      replaced++;
    } else {
      problems.push('icon changed. Run with --apply to swap it in');
      manifestOk = false;
    }
  }

  if (!problems.length && !done.length) { say(`${key}: unchanged`); continue; }
  say(`${key}:`);
  done.forEach((d) => say(`   done: ${d}`));
  problems.forEach((p) => { say(`   NEEDS A LOOK: ${p}`); needsLook++; });
  if (APPLY && manifestOk) next[key] = { pictures: bases, icon: iconBase };
  else if (APPLY) {
    // keep flagging what was not handled, but remember the parts that were
    next[key] = { pictures: was.pictures.map((b, i) => (bases[i] !== b && done.some((x) => x.startsWith(`picture ${i + 1} `))) ? bases[i] : b), icon: done.some((x) => x.startsWith('icon')) ? iconBase : was.icon };
  }
}

if (INIT || APPLY || ACCEPT) writeFileSync(SEEN, JSON.stringify(next, null, 2) + '\n');

console.log(`Changed pictures are downloaded to: ${LOOK_DIR}`);
console.log(out.join('\n'));
console.log(`\nRESULT: ${replaced} item(s) replaced, ${needsLook} item(s) need a look.`);
