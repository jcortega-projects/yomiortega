// Mapa mundial centrado en el Pacífico (China ← → Américas) con China y
// Latinoamérica resaltadas. China se baja verticalmente (DY) para quedar a la
// altura de Latinoamérica. Salida: src/_includes/worldmap.svg
const fs = require("fs");
const d3 = require("d3-geo");
const topojson = require("topojson-client");
const world = require("world-atlas/countries-110m.json");
const landTopo = require("world-atlas/land-110m.json");

const countries = topojson.feature(world, world.objects.countries).features;
const land = topojson.feature(landTopo, landTopo.objects.land);

const W = 1600, H = 760;
const DY = 0;

// Centrado en el Pacífico: 180° al centro → China a la izquierda, Américas a la derecha
const projection = d3.geoEquirectangular()
  .rotate([-180, 0])
  .fitWidth(W, { type: "Sphere" });
const [, ty] = projection.translate();
projection.translate([W / 2, ty]);
const path = d3.geoPath(projection);

// Regiones a resaltar
const LATAM = new Set([
  "Mexico", "Guatemala", "Belize", "Honduras", "El Salvador", "Nicaragua", "Costa Rica",
  "Panama", "Colombia", "Venezuela", "Guyana", "Suriname", "Ecuador", "Peru", "Brazil",
  "Bolivia", "Paraguay", "Chile", "Argentina", "Uruguay", "Cuba", "Dominican Rep.", "Haiti",
  "Jamaica", "Puerto Rico", "Trinidad and Tobago",
]);
const CHINA = new Set(["China", "Taiwan"]);

const linePaths = [];   // países normales (contorno)
const hiPaths = [];     // Latinoamérica (resaltada)
const chinaPaths = [];  // China (resaltada, se baja con DY)
for (const f of countries) {
  const d = path(f);
  if (!d) continue;
  const name = f.properties.name;
  if (CHINA.has(name)) chinaPaths.push(`<path d="${d}"/>`);
  else if (LATAM.has(name)) hiPaths.push(`<path d="${d}"/>`);
  else linePaths.push(`<path d="${d}"/>`);
}

// Puntos decorativos sobre tierra; los de China se separan para bajarlos con DY
const chinaFeats = countries.filter((f) => CHINA.has(f.properties.name));
const inChina = (lon, lat) => chinaFeats.some((f) => d3.geoContains(f, [lon, lat]));
const dots = [];
const chinaDots = [];
for (let lon = -180; lon <= 180; lon += 4) {
  for (let lat = -58; lat <= 80; lat += 4) {
    if (d3.geoContains(land, [lon, lat])) {
      const p = projection([lon, lat]);
      if (!p) continue;
      const c = `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="1.6"/>`;
      if (inChina(lon, lat)) chinaDots.push(c); else dots.push(c);
    }
  }
}

// viewBox recorta arriba/abajo para quitar Antártida y Ártico vacío
const svg =
`<svg class="worldmap" viewBox="0 90 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">` +
`<g class="wm-lines">${linePaths.join("")}</g>` +
`<g class="wm-hi">${hiPaths.join("")}</g>` +
`<g class="wm-hi" transform="translate(0,${DY})">${chinaPaths.join("")}</g>` +
`<g class="wm-dots">${dots.join("")}</g>` +
`<g class="wm-dots" transform="translate(0,${DY})">${chinaDots.join("")}</g>` +
`</svg>`;

fs.writeFileSync("src/_includes/worldmap.svg", svg);
console.log(`Mapa generado: China bajada ${DY}px, ${chinaDots.length} puntos en China, ${dots.length + chinaDots.length} puntos totales, ${(svg.length / 1024).toFixed(0)} KB`);
