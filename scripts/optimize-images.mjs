import sharp from "sharp";
import { readdirSync } from "fs";
import path from "path";

const dir = path.resolve("public/images");
const files = readdirSync(dir).filter((f) => f.endsWith(".png"));

for (const file of files) {
  const input = path.join(dir, file);
  const output = path.join(dir, file.replace(/\.png$/, ".webp"));
  await sharp(input).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(output);
  console.log(`optimized ${file} -> ${path.basename(output)}`);
}
