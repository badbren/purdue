// One-off: compress showcase photos from the raw folder into public/showcase.
// Usage: node scripts/optimize-images.mjs "C:/path/to/raw/photos"
import sharp from "sharp";
import { readdir, mkdir } from "fs/promises";
import path from "path";

const SRC = process.argv[2] ?? "C:/Users/Nesuc/Desktop/New folder";
const OUT = new URL("../public/showcase/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /\.jpe?g$/i.test(f)).sort();
let i = 1;
for (const f of files) {
  const name = `work-${String(i).padStart(2, "0")}.jpg`;
  await sharp(path.join(SRC, f))
    .rotate() // respect EXIF orientation from phone cameras
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 75, mozjpeg: true })
    .toFile(path.join(OUT, name));
  console.log(`${f} -> ${name}`);
  i++;
}
console.log(`Done: ${files.length} images -> ${OUT}`);
