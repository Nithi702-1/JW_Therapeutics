// One-shot scraper: downloads images referenced on the JW Therapeutics homepage
// into public/images/ with stable, ASCII filenames. Safe to re-run.
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/images");
const BASE = "https://www.jwtherapeutics.com";

const ASSETS = [
  // Logo + UI chrome
  { url: "/media/1zipcze0/logo.png", file: "logo.png" },
  { url: "/media/ow3awqo3/search-interface-symbol.png", file: "search-icon.png" },

  // Hero banner slides
  {
    url: "/media/utmk33qh/%E5%85%AC%E5%8F%B8kv%E4%BA%8C1-banner-20220906.jpg",
    file: "hero-1.jpg",
  },
  {
    url: "/media/gcahjmu0/%E5%85%AC%E5%8F%B8kv%E4%BA%8C2-banner-20220906.jpg",
    file: "hero-2.jpg",
  },
  {
    url: "/media/wyjp235y/%E5%85%AC%E5%8F%B8kv%E4%BA%8C3-banner-20220906.jpg",
    file: "hero-3.jpg",
  },
  { url: "/media/xdaphzyy/star-icon.png", file: "star-icon.png" },

  // About-section tab icons (normal + hover)
  { url: "/media/3iddxa3j/about-1.png", file: "about-1.png" },
  { url: "/media/2ina5vcp/about-orange-1.png", file: "about-orange-1.png" },
  { url: "/media/e4kaj04j/about-2.png", file: "about-2.png" },
  { url: "/media/atqfs2t0/about-orange-2.png", file: "about-orange-2.png" },
  { url: "/media/cpxlatpe/about-3.png", file: "about-3.png" },
  { url: "/media/1ztegocr/about-orange-3.png", file: "about-orange-3.png" },

  // Research highlight + pipeline imagery
  { url: "/media/eivpj4xb/vcg41n868254530.png", file: "research-highlight.png" },
  {
    url: "/media/xbfphfrl/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210322145439.png",
    file: "pipeline.png",
  },

  // R&D / quick-links grid tiles
  { url: "/media/sqndxhwg/vcg21gic6332800.png", file: "tile-products.png" },
  { url: "/media/vundfo14/vcg41n932742950.png", file: "tile-2.png" },
  { url: "/media/jmlm14rb/vcg41n1095921746.png", file: "tile-3.png" },
  { url: "/media/4vkmbkei/vcg41n1161715003.png", file: "tile-4.png" },
  { url: "/media/ivydamn0/medicon.png", file: "tile-medicon.png" },
  { url: "/media/x25d1dqj/vcg211186554828.png", file: "tile-process.png" },
  { url: "/media/jgodigeo/vcg41n1175886655.png", file: "tile-join.png" },
  { url: "/media/us1hmruh/vcg41n1174123909.png", file: "tile-8.png" },

  // Footer
  { url: "/media/ussnnb3x/jw-1.png", file: "footer-photo.png" },
  { url: "/media/caubgnj1/icon.png", file: "mps-icon.png" },
];

async function downloadOne({ url, file }) {
  const target = resolve(OUT_DIR, file);
  if (existsSync(target)) {
    return { file, skipped: true };
  }
  const fullUrl = url.startsWith("http") ? url : BASE + url;
  const res = await fetch(fullUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (jw-therapeutics-remap-scraper)" },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${fullUrl}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(target, buf);
  return { file, bytes: buf.length };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const results = await Promise.allSettled(ASSETS.map(downloadOne));
  let ok = 0;
  let skip = 0;
  let fail = 0;
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const a = ASSETS[i];
    if (r.status === "fulfilled") {
      if (r.value.skipped) {
        skip++;
        console.log(`skip   ${a.file}`);
      } else {
        ok++;
        console.log(`ok     ${a.file} (${r.value.bytes} bytes)`);
      }
    } else {
      fail++;
      console.error(`fail   ${a.file}: ${r.reason.message}`);
    }
  }
  console.log(`\nDone. ok=${ok} skipped=${skip} failed=${fail}`);
  if (fail > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
