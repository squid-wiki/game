// Original FireRed/LeafGreen sprites, mirrored locally so articles need no third-party requests.
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {renderRegionMap} from './render-region-map.mjs';

// Pin upstream revisions so regeneration cannot silently switch game versions/art.
const spriteRevision = 'c0542f7c51215d9672439012838c99f520596cbd';
const gameRevision = 'ce6406d8c2eaf46d543c8a2606de0c3cb1951982';
const manifest = {game: 'Pokémon FireRed / LeafGreen (GBA, Generation III)', spriteRevision, gameRevision, assets: []};
async function download(url, destination, path) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (path.endsWith('.png') && bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error(`${path}: not PNG`);
  // Preserve any locally customized pre-existing sprite instead of overwriting it.
  let existing;
  try { existing = await readFile(destination); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (existing && !existing.equals(bytes)) throw new Error(`${path}: differs from pinned upstream; inspect before replacing`);
  await writeFile(destination, bytes);
  manifest.assets.push({path, source: url, sha256: createHash('sha256').update(bytes).digest('hex')});
  return bytes;
}

const target = new URL('../site/static/img/pokemon/firered/sprites/', import.meta.url);
await mkdir(target, {recursive: true});
const sprites = {1: 'bulbasaur', 4: 'charmander', 6: 'charizard', 7: 'squirtle',
  12: 'butterfree', 25: 'pikachu', 56: 'mankey', 74: 'geodude', 95: 'onix'};
for (const [id, name] of Object.entries(sprites)) {
  const url = `https://raw.githubusercontent.com/PokeAPI/sprites/${spriteRevision}/sprites/pokemon/versions/generation-iii/firered-leafgreen/${id}.png`;
  const bytes = await download(url, new URL(`${name}.png`, target), `sprites/${name}.png`);
  console.log(`${name}: ${bytes.length} bytes`);
}

const maps = new URL('../site/static/img/pokemon/firered/maps/', import.meta.url);
await mkdir(maps, {recursive: true});
const inputs = [];
for (const [source, file] of [['region_map.png', 'region-map-tiles.png'], ['kanto.bin', 'kanto.bin'], ['region_map.pal', 'region-map.pal']]) {
  inputs.push(await download(`https://raw.githubusercontent.com/pret/pokefirered/${gameRevision}/graphics/region_map/${source}`, new URL(file, maps), `maps/${file}`));
}
const map = renderRegionMap(inputs[0], inputs[1], inputs[2].toString('utf8'));
await writeFile(new URL('kanto-town-map.png', maps), map);
manifest.assets.push({path: 'maps/kanto-town-map.png', derivedFrom: ['maps/region-map-tiles.png', 'maps/kanto.bin', 'maps/region-map.pal'], sha256: createHash('sha256').update(map).digest('hex')});
await writeFile(new URL('../assets-manifest.json', target), JSON.stringify(manifest, null, 2) + '\n');
console.log('Kanto map: rendered original tiles, tilemap and palette at 240 × 160');
