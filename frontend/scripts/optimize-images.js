// Usage: node scripts/optimize-images.js [--dry]   (from frontend/; rewrites public/ images in place)
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', 'public');
const MIN_BYTES = 150 * 1024;
const MAX_WIDTH = 1600;
const MIN_SAVING = 0.15;
const dry = process.argv.includes('--dry');

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) yield full;
  }
}

async function optimize(file) {
  const input = fs.readFileSync(file);
  if (input.length < MIN_BYTES) return null;
  const ext = path.extname(file).toLowerCase();
  const pipeline = sharp(input, { failOn: 'none' })
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true });

  let output;
  if (ext === '.png') output = await pipeline.png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 }).toBuffer();
  else if (ext === '.webp') output = await pipeline.webp({ quality: 80 }).toBuffer();
  else output = await pipeline.jpeg({ quality: 78, mozjpeg: true, progressive: true }).toBuffer();

  if (output.length > input.length * (1 - MIN_SAVING)) return { file, before: input.length, after: input.length, skipped: true };
  if (!dry) fs.writeFileSync(file, output);
  return { file, before: input.length, after: output.length };
}

(async () => {
  let before = 0;
  let after = 0;
  let changed = 0;
  for (const file of walk(ROOT)) {
    try {
      const r = await optimize(file);
      if (!r) continue;
      before += r.before;
      after += r.after;
      if (!r.skipped) {
        changed += 1;
        console.log(`${(r.before / 1024).toFixed(0).padStart(6)} KB -> ${(r.after / 1024).toFixed(0).padStart(5)} KB  ${path.relative(ROOT, file)}`);
      }
    } catch (err) {
      console.warn(`skip ${path.relative(ROOT, file)}: ${err.message}`);
    }
  }
  console.log(`\n${dry ? '[dry run] ' : ''}${changed} files: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);
})();
