import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../geojson");

const CHUNK_SIZE = 5000;

const split = (filename) => {
  console.log(`📦 Processando ${filename}...`);
  const data = JSON.parse(
    fs.readFileSync(path.join(dataDir, filename), "utf-8"),
  );
  const features = data.features;
  const baseName = filename.replace(".json", "");

  let part = 1;
  for (let i = 0; i < features.length; i += CHUNK_SIZE) {
    const chunk = features.slice(i, i + CHUNK_SIZE);
    const fc = { type: "FeatureCollection", features: chunk };
    const outFile = path.join(dataDir, `${baseName}-part${part}.json`);
    fs.writeFileSync(outFile, JSON.stringify(fc));
    console.log(`  ✅ part${part} — ${chunk.length} features`);
    part++;
  }

  console.log(`  🗑️  Removendo original...`);
  // fs.unlinkSync(path.join(dataDir, filename));
  // console.log(`  ✅ ${filename} removido\n`);
};

// split("mt-embargoed-areas-clipped.json");
// split("mt-public-forests-clipped.json");
// split("mt-vegetation-suppression-authorization-clipped.json");
// split("mt-car-properties-clipped.json");
