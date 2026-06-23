import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const sources = {
  light: path.join(root, "public/nova-icon.png"),
  dark: path.join(root, "public/nova-icon-white.png"),
};

async function squarePng(source, size, outPath) {
  await sharp(source)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(outPath);
  console.log("wrote", path.relative(root, outPath), size);
}

async function ensureWhiteIcon(source, outPath) {
  const { width, height, channels } = await sharp(source).metadata();
  const rgba = await sharp(source).ensureAlpha().raw().toBuffer();

  for (let i = 0; i < rgba.length; i += channels) {
    const alpha = rgba[i + 3];
    if (alpha > 0) {
      rgba[i] = 255;
      rgba[i + 1] = 255;
      rgba[i + 2] = 255;
    }
  }

  await sharp(rgba, { raw: { width, height, channels } })
    .png()
    .toFile(outPath);

  console.log("wrote", path.relative(root, outPath));
}

const tmp = path.join(root, "scripts/.icon-tmp");
fs.mkdirSync(tmp, { recursive: true });

const whiteSource = path.join(tmp, "white-source.png");
await ensureWhiteIcon(sources.light, whiteSource);

const outputs = [
  { source: sources.light, name: "nova-icon.png" },
  { source: whiteSource, name: "nova-icon-white.png" },
];

for (const { source, name } of outputs) {
  const tmpOut = path.join(tmp, name);
  await squarePng(source, 512, tmpOut);
  fs.copyFileSync(tmpOut, path.join(root, "public", name));
}

console.log("icons ready for light/dark browser themes");
