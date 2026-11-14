// Self-contained SVGs: embedded original FRLG pixels also work inside an HTML <img>.
import {readFile, writeFile} from 'node:fs/promises';
const root = new URL('../site/static/img/pokemon/', import.meta.url);
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const text = (x, y, value, cls = 'body', extra = '') => `<text x="${x}" y="${y}" class="${cls}" ${extra}>${escape(value)}</text>`;
const rect = (x, y, w, h, fill = '#fff', stroke = '#d9e3e6') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${stroke}"/>`;
const line = (x1, y1, x2, y2, color = '#bacbd0', extra = '') => `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="3" ${extra}/>`;
const badge = (x, y, label, color) => `<rect x="${x}" y="${y}" width="70" height="28" rx="5" fill="${color}"/>${text(x + 35, y + 21, label, 'badge', 'text-anchor="middle"')}`;
const embedded = async (path, x, y, w, h = w) => `<image x="${x}" y="${y}" width="${w}" height="${h}" style="image-rendering:pixelated" href="data:image/png;base64,${(await readFile(new URL(path, root))).toString('base64')}"/>`;
const sprite = (name, x, y, size = 128) => embedded(`firered/sprites/${name}.png`, x, y, size);
const arrow = (points, color = '#6b7f88') => `<path d="${points}" fill="none" stroke="${color}" stroke-width="3" marker-end="url(#arrow)"/>`;
async function save(file, height, title, subtitle, content, description) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 ${height}" role="img" aria-labelledby="title desc" font-family="'Microsoft YaHei','PingFang SC',sans-serif">
<title id="title">${escape(title)}</title><desc id="desc">${escape(description)}</desc>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#6b7f88"/></marker></defs>
<style>.title{font-size:25px;font-weight:700;fill:#173740}.heading{font-size:22px;font-weight:700;fill:#173740}.body{font-size:20px;fill:#294752}.small{font-size:17px;fill:#526b75}.note{font-size:15px;fill:#526b75}.badge{font-size:17px;font-weight:700;fill:#fff}.number{font-size:20px;font-weight:700;fill:#fff}.value{font-size:24px;font-weight:700;fill:#173740}</style>
${rect(1, 1, 718, height - 2, '#f6f9f8')}${text(28, 42, title, 'title')}${text(28, 72, subtitle, 'small')}
${content}
${text(28, height - 20, '原版像素素材 · 中文攻略标注 · 非游戏截图', 'note')}
</svg>\n`;
  await writeFile(new URL(file, root), svg);
  console.log(file);
}

const starters = [
  {name: '妙蛙种子', sprite: 'bulbasaur', type: [['草', '#609c39'], ['毒', '#a040a0']], evo: '妙蛙种子 → 妙蛙草 → 妙蛙花', levels: 'Lv16 进化 / Lv32 进化 · 草 / 毒', total: 525, match: '小刚：有利　小霞：有利　马志士：抗电', move: 'Lv7 寄生种子 · Lv10 藤鞭', tip: '草系招式打小刚的两只宝可梦均为 4 倍。', color: '#e9f5e8'},
  {name: '小火龙', sprite: 'charmander', type: [['火', '#cf602d']], evo: '小火龙 → 火恐龙 → 喷火龙', levels: 'Lv16 进化 / Lv36 进化 · 最终为火 / 飞行', total: 534, match: '小刚：不利　小霞：不利　马志士：中性', move: 'Lv7 火花 · Lv13 金属爪', tip: '打小刚可用金属爪，搭配猴怪更稳。', color: '#fff0e5'},
  {name: '杰尼龟', sprite: 'squirtle', type: [['水', '#537fc8']], evo: '杰尼龟 → 卡咪龟 → 水箭龟', levels: 'Lv16 进化 / Lv36 进化 · 水', total: 530, match: '小刚：有利　小霞：互相抗水　马志士：不利', move: 'Lv7 泡沫 · Lv13 水枪', tip: '水系招式打小刚的两只宝可梦均为 4 倍。', color: '#eaf2ff'},
];
let content = '';
for (const [i, mon] of starters.entries()) {
  const y = 96 + i * 292;
  content += rect(24, y, 672, 276, mon.color) + await sprite(mon.sprite, 30, y + 40) + text(174, y + 36, mon.name, 'heading');
  mon.type.forEach(([label, color], j) => {content += badge(390 + j * 78, y + 14, label, color);});
  content += text(174, y + 76, mon.evo) + text(174, y + 106, mon.levels, 'small');
  content += text(174, y + 140, `最终形态种族值合计 ${mon.total}`, 'small');
  content += line(48, y + 165, 672, y + 165) + text(48, y + 196, mon.match, 'small');
  content += text(48, y + 228, mon.move) + text(48, y + 256, mon.tip, 'small');
}
await save('firered/starters.svg', 1014, '御三家怎么选', '《火红 / 叶绿》正面精灵 · 普通配色 · 第三世代数据', content, '妙蛙种子草毒、小火龙火、杰尼龟水。进化等级和开局招式按火红叶绿标注；道馆相性为攻略建议，不代表保证获胜。');

content = rect(24, 96, 672, 432);
const nodes = [{name:'妙蛙种子',sprite:'bulbasaur',x:296,y:105,label:'草 / 毒'}, {name:'杰尼龟',sprite:'squirtle',x:500,y:326,label:'水'}, {name:'小火龙',sprite:'charmander',x:92,y:326,label:'火'}];
for (const n of nodes) content += await sprite(n.sprite,n.x,n.y) + text(n.x+64,n.y+132,n.name,'heading','text-anchor="middle"') + text(n.x+64,n.y+158,n.label,'small','text-anchor="middle"');
content += arrow('M428 245 L524 334') + text(514,279,'草 → 水 ×2','small');
content += arrow('M496 405 L228 405') + text(360,393,'水 → 火 ×2','small','text-anchor="middle"');
content += arrow('M194 334 L292 245') + text(68,279,'火 → 草 ×2','small');
content += text(360,510,'箭头：使用该属性招式 → 受到克制的对手','small','text-anchor="middle"');
content += rect(24,548,672,276) + text(48,582,'你选', 'heading') + text(398,582,'劲敌选','heading');
for(const [i,[you,rival]] of [['bulbasaur','charmander'],['charmander','squirtle'],['squirtle','bulbasaur']].entries()){
  const y=590+i*74;
  const name = key => starters.find(m=>m.sprite===key).name;
  content += await sprite(you,42,y,64)+text(116,y+39,name(you))+arrow(`M294 ${y+30} L366 ${y+30}`)+await sprite(rival,388,y,64)+text(466,y+39,name(rival));
}
content += rect(24,844,672,86,'#fff6df') + text(44,879,'第一战双方 Lv5，只有一般系招式。') + text(44,907,'这时还用不上草、火、水的属性克制。','small');
await save('firered/type-triangle.svg',976,'草、火、水的克制关系','伤害倍率按《火红 / 叶绿》的实际属性计算',content,'草招式打杰尼龟两倍、水招式打小火龙两倍、火招式打妙蛙种子两倍。妙蛙种子实际为草毒双属性。劲敌选择与你相克的御三家，但开局招式均为一般属性。');

content = rect(24,96,672,470) + `<svg x="60" y="112" width="600" height="432" viewBox="16 16 200 144">${await embedded('firered/maps/kanto-town-map.png',0,0,240,160)}</svg>`;
// Game cursor coordinates: x*8+36, y*8+36. Original tilemap is 240x160.
// Pallet (4,11), Viridian (4,8), Pewter (4,4): (68,124), (68,100), (68,68).
const pin = (x,y,label,lx,ly) => `<circle cx="${x}" cy="${y}" r="12" fill="none" stroke="#fff" stroke-width="3"/>${line(x+14,y,lx-8,ly-7,'#fff')}${rect(lx-4,ly-26,120,36,'#173740','#173740')}${text(lx+8,ly,label,'badge')}`;
content += pin(216,436,'真新镇',278,444) + pin(216,364,'常青市',278,372) + pin(216,268,'尼比市',278,276);
content += text(28,603,'主线向北走；常青市送包裹时要往返真新镇。');
const steps=[['真新镇','取伤药 → 选御三家 → 劲敌第一战'],['1 号道路 → 常青市','商店领包裹 → 回研究所交给大木博士'],['真新镇 → 常青市','拿图鉴与精灵球，再拿城镇地图后返回'],['2 号道路 → 常青森林','捕捉队友；森林里有 5% 概率遇到皮卡丘'],['2 号道路北段 → 尼比市','先到宝可梦中心回复，再挑战小刚']];
for(const [i,[title,detail]]of steps.entries()){
  const y=624+i*91;
  content += rect(24,y,672,79)+`<circle cx="54" cy="${y+36}" r="18" fill="#5e4a88"/>`+text(54,y+43,i+1,'number','text-anchor="middle"')+text(88,y+31,title,'heading')+text(88,y+60,detail,'small');
}
content += rect(24,1096,672,100,'#e9f5e8')+await sprite('mankey',28,1108,80)+text(120,1132,'可选支线：常青市往西 → 22 号道路','heading')+text(120,1165,'两版都能抓猴怪；也可能触发可选的劲敌战。','small');
await save('firered/route-pallet-pewter.svg',1244,'从真新镇到第一枚徽章','底图按游戏原始图块、布局和调色板还原；中文为攻略标注',content,'原版关都地图标注真新镇、常青市和尼比市。主线通过1号道路、2号道路与常青森林，22号道路在常青市西侧，是可选支线。此图不用于森林内部逐格导航。');

content = rect(24,96,324,198,'#f0ece3')+rect(364,96,332,198,'#f0ece3');
content += await sprite('geodude',28,110)+text(164,144,'小拳石','heading')+text(164,180,'Lv12','value')+text(164,212,'岩石 / 地面','small')+text(48,272,'水 ×4 · 草 ×4 · 电 ×0');
content += await sprite('onix',368,110)+text(504,144,'大岩蛇','heading')+text(504,180,'Lv14','value')+text(504,212,'岩石 / 地面','small')+text(388,272,'水 ×4 · 草 ×4 · 电 ×0');
const plans=[
 ['squirtle','杰尼龟','建议 Lv10–12','泡沫（水）· Lv7 学会','水系特殊攻击，打两只都是 4 倍。','#eaf2ff'],
 ['bulbasaur','妙蛙种子','建议 Lv10–12','藤鞭（草）· Lv10 学会','草系特殊攻击，打两只都是 4 倍。','#e9f5e8'],
 ['charmander','小火龙','建议 Lv14 以上','金属爪（钢）· Lv13 学会','2 倍，但对手物防高；要防岩石封。','#fff0e5'],
 ['mankey','猴怪','建议 Lv10–12','踢倒（格斗）· Lv6 学会','2 倍；大岩蛇 210 kg，招式威力 120。','#f3eee7'],
 ['butterfree','巴大蝶','Lv10 进化后','念力（超能力）· Lv10 学会','等倍，能打低特防；但自身 4 倍弱岩石。','#f0eafa'],
];
for(const [i,[key,name,level,move,tip,color]]of plans.entries()){
  const y=314+i*148;
  content+=rect(24,y,672,134,color)+await sprite(key,24,y+12,112)+text(148,y+32,name,'heading')+text(394,y+32,level)+text(148,y+70,move)+text(148,y+106,tip,'small');
}
content+=rect(24,1070,672,106,'#fff6df')+await sprite('pikachu',24,1080,96)+text(132,1106,'皮卡丘的电系招式无效。','heading')+text(132,1137,'建议等级是攻略建议，无法保证一击打倒或获胜。','small')+text(132,1163,'三代按属性分物理 / 特殊；带伤药并及时回复。','small');
await save('firered/brock-plan.svg',1224,'小刚攻略：先看属性，再选招式','对手等级为游戏数据；建议等级需结合个体、队友与道具',content,'小刚使用12级小拳石和14级大岩蛇。水草四倍，钢格斗两倍，超能力等倍，电无效。猴怪两版均可获得。巴大蝶四倍弱岩石，使用念力有风险。');

// Replace the approximate stacked chart with bars whose lengths equal the final stats.
content=rect(24,96,672,158)+await sprite('charizard',28,106)+text(178,136,'喷火龙 · Lv50','heading')+text(178,174,'速度种族值 100 · 普通形态')+text(178,210,'性格修正在最后一步向下取整。','small');
const cases=[['减速性格',0,0,90,'#8f7b9f'],['无性格修正',0,0,100,'#618fa6'],['胆小性格',31,252,110,'#5e4a88']];
for(const [i,[label,iv,ev,nature,color]]of cases.entries()){
  const before=Math.floor((2*100+iv+Math.floor(ev/4))*50/100)+5;
  const value=Math.floor(before*nature/100), y=286+i*142;
  content+=text(32,y,label,'heading')+text(32,y+30,`IV ${iv} · EV ${ev} · 速度 ×${nature/100}`,'small')+`<rect x="32" y="${y+45}" width="${value*3.5}" height="32" rx="6" fill="${color}"/>`+text(44+value*3.5,y+70,value,'value');
  content+=text(32,y+106,`⌊(⌊(200 + ${iv} + ${Math.floor(ev/4)}) × 0.5⌋ + 5) × ${nature/100}⌋ = ${value}`,'small');
}
content+=rect(24,728,672,88,'#e9f5e8')+text(44,764,'胆小：⌊(147 + 5) × 1.1⌋ = 167')+text(44,795,'条长按最终速度绘制，避免把近似贡献当成精确加值。','small');
await save('speed-example.svg',864,'同样 50 级，速度为什么不同','以《火红 / 叶绿》的喷火龙为例；其他条件固定',content,'三组速度精确计算分别为94、105、167。条形长度按最终能力值等比例绘制。普通喷火龙使用第三世代火红叶绿精灵。');
