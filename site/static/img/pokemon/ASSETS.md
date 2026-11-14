# 配图来源与版本

游戏图像统一采用 GBA《宝可梦 火红 / 叶绿》的普通配色素材，不混用初代、红蓝宝石、后续重制版、闪光或 AI 重绘图。SVG 是本站编排的中文攻略图，不冒充游戏截图。

- `firered/sprites/*.png`：PokeAPI/sprites 的 `versions/generation-iii/firered-leafgreen` 正面精灵，固定版本 `c0542f7c51215d9672439012838c99f520596cbd`。原始 64 × 64 像素，不裁切、不插值、不改色。
- `firered/maps/region-map-tiles.png`、`kanto.bin`、`region-map.pal`：pret/pokefirered 的 `graphics/region_map/`，固定版本 `ce6406d8c2eaf46d543c8a2606de0c3cb1951982`。
- `firered/maps/kanto-town-map.png`：按上面的原始图块、30 × 20 图块布局、GBA 翻转位与调色板组还原的 240 × 160 地图图层。不是含边框、地点文字和光标的完整游戏截图。路线图上的中文定位和攻略步骤由本站添加；不提供森林内部逐格导航。
- `firered/starters.svg`、`type-triangle.svg`、`route-pallet-pewter.svg`、`brock-plan.svg` 和 `speed-example.svg`：原版素材以内嵌 PNG 方式放入 SVG，离线及 HTML `<img>` 加载均不依赖外部资源。使用 `image-rendering: pixelated` 保持像素边缘。
- `four-factors.svg`、`physical-special.svg`、`timeline.svg`：机制或历史教学示意图，不是游戏 UI。

下载地址、固定版本及 SHA-256 记录在 `firered/assets-manifest.json`。素材用于非官方攻略说明，其权利仍归 Nintendo / Creatures / GAME FREAK 等原权利人；不随本站代码的 MIT 或文章的 CC 许可重新授权。

## 更新与复现

在 `game/` 目录执行：

```sh
node scripts/fetch-article-sprites.mjs
node scripts/build-article-figures.mjs
```

第一个命令需要网络，校验 PNG 并按固定源重建地图；已有本地素材若与上游不同会报错，不直接覆盖。第二个命令只读取本地素材，可离线重建五张图。不要手改这五张 SVG，请修改生成脚本。

招式、野外分布、馆主队伍与能力计算按同一固定版本的 `src/data/pokemon/level_up_learnsets.h`、`src/data/wild_encounters.json`、`src/data/trainer_parties.h`、`src/data/pokemon/species_info.h` 与 `src/pokemon.c` 核对。树果的使用限制见 `src/data/items.json`。建议等级不是游戏数据，不保证一击打倒或获胜。
