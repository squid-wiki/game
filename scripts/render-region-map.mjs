// Render the game's 4bpp GBA tiles using its tilemap and palette, without redrawing them.
import {deflateSync, inflateSync} from 'node:zlib';

function chunk(type, data) {
  const body = Buffer.concat([Buffer.from(type), data]);
  let crc = 0xffffffff;
  for (const byte of body) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  const result = Buffer.alloc(data.length + 12);
  result.writeUInt32BE(data.length);
  body.copy(result, 4);
  result.writeUInt32BE((crc ^ 0xffffffff) >>> 0, result.length - 4);
  return result;
}

export function renderRegionMap(png, tilemap, paletteText) {
  const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
  if (png[24] !== 8 || png[25] !== 3 || png[28] !== 0) throw new Error('Expected noninterlaced 8-bit indexed tiles');
  if (width % 8 || height % 8 || tilemap.length !== 30 * 20 * 2) throw new Error('Unexpected GBA map dimensions');
  const compressed = [];
  for (let offset = 8; offset < png.length;) {
    const size = png.readUInt32BE(offset);
    if (png.toString('ascii', offset + 4, offset + 8) === 'IDAT') compressed.push(png.subarray(offset + 8, offset + 8 + size));
    offset += size + 12;
  }
  const rows = inflateSync(Buffer.concat(compressed));
  const pixels = Buffer.alloc(width * height);
  const paeth = (a, b, c) => {
    const p = a + b - c, da = Math.abs(p - a), db = Math.abs(p - b), dc = Math.abs(p - c);
    return da <= db && da <= dc ? a : db <= dc ? b : c;
  };
  for (let y = 0; y < height; y++) {
    const filter = rows[y * (width + 1)];
    if (filter > 4) throw new Error('Unknown PNG filter');
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const a = x ? pixels[i - 1] : 0, b = y ? pixels[i - width] : 0, c = x && y ? pixels[i - width - 1] : 0;
      const prediction = [0, a, b, Math.floor((a + b) / 2), paeth(a, b, c)][filter];
      pixels[i] = (rows[y * (width + 1) + 1 + x] + prediction) & 255;
    }
  }
  const palette = paletteText.trim().split(/\r?\n/).slice(3).map(line => line.trim().split(/\s+/).map(Number));
  const output = Buffer.alloc((240 * 3 + 1) * 160);
  for (let y = 0; y < 160; y++) for (let x = 0; x < 240; x++) {
    const entry = tilemap.readUInt16LE((Math.floor(y / 8) * 30 + Math.floor(x / 8)) * 2);
    const tile = entry & 1023;
    if (tile >= width * height / 64) throw new Error('Tile index outside sheet');
    const tx = entry & 1024 ? 7 - x % 8 : x % 8, ty = entry & 2048 ? 7 - y % 8 : y % 8;
    const index = pixels[(Math.floor(tile / (width / 8)) * 8 + ty) * width + (tile % (width / 8)) * 8 + tx];
    const color = palette[(entry >>> 12) * 16 + (index & 15)];
    if (!color) throw new Error('Palette index outside palette');
    output.set(color, y * 721 + 1 + x * 3);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(240); header.writeUInt32BE(160, 4); header[8] = 8; header[9] = 2;
  return Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), chunk('IHDR', header), chunk('IDAT', deflateSync(output)), chunk('IEND', Buffer.alloc(0))]);
}
