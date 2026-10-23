// Genera los íconos del lanzador y la pantalla de inicio de Android a partir de assets/icon.svg.
// Ejecutar después de `npx cap add android`: npm run android-assets
import { readFile, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const res = (p) => root(`android/app/src/main/res/${p}`);

try {
  await access(res(''));
} catch {
  console.error('No existe la carpeta android/. Ejecuta primero: npx cap add android');
  process.exit(1);
}

const iconSvg = await readFile(root('assets/icon.svg'));

// Capa frontal del ícono adaptable: solo la nota, centrada en la zona segura (66 de 108 dp).
const foregroundSvg = Buffer.from(iconSvg.toString()
  .replace(/<rect[^>]*\/>/, '')
  .replace('viewBox="0 0 1024 1024"', 'viewBox="-298 -298 1620 1620"'));

const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
const circle = (s) => Buffer.from(`<svg width="${s}" height="${s}"><circle cx="${s / 2}" cy="${s / 2}" r="${s / 2}"/></svg>`);

for (const [d, k] of Object.entries(densities)) {
  const legacy = Math.round(48 * k);
  const fg = Math.round(108 * k);
  await sharp(iconSvg, { density: 300 }).resize(legacy, legacy).png().toFile(res(`mipmap-${d}/ic_launcher.png`));
  await sharp(iconSvg, { density: 300 }).resize(legacy, legacy)
    .composite([{ input: circle(legacy), blend: 'dest-in' }]).png().toFile(res(`mipmap-${d}/ic_launcher_round.png`));
  await sharp(foregroundSvg, { density: 300 }).resize(fg, fg).png().toFile(res(`mipmap-${d}/ic_launcher_foreground.png`));
}

await writeFile(res('values/ic_launcher_background.xml'),
  '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#10B981</color>\n</resources>\n');

// Pantalla de inicio: fondo oscuro con el ícono al centro
const splashSizes = {
  'drawable': [480, 320],
  'drawable-port-mdpi': [320, 480], 'drawable-port-hdpi': [480, 800], 'drawable-port-xhdpi': [720, 1280],
  'drawable-port-xxhdpi': [960, 1600], 'drawable-port-xxxhdpi': [1280, 1920],
  'drawable-land-mdpi': [480, 320], 'drawable-land-hdpi': [800, 480], 'drawable-land-xhdpi': [1280, 720],
  'drawable-land-xxhdpi': [1600, 960], 'drawable-land-xxxhdpi': [1920, 1280]
};
for (const [dir, [w, h]] of Object.entries(splashSizes)) {
  const s = Math.round(Math.min(w, h) * 0.28);
  const rounded = Buffer.from(`<svg width="${s}" height="${s}"><rect width="${s}" height="${s}" rx="${s * 0.22}"/></svg>`);
  const logo = await sharp(iconSvg, { density: 300 }).resize(s, s)
    .composite([{ input: rounded, blend: 'dest-in' }]).png().toBuffer();
  await sharp({ create: { width: w, height: h, channels: 4, background: '#09090b' } })
    .composite([{ input: logo, gravity: 'centre' }]).png().toFile(res(`${dir}/splash.png`));
}

console.log('✔ Íconos y pantalla de inicio de Android generados');
