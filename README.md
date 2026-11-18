# World news front page — 17 November 2026 · v3

[![make.fun · news-image-20261117](https://make.fun/badge/news-image-20261117.svg)](https://make.fun/bounty/news-image-20261117?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261117)
[![rank](https://make.fun/badge/news-image-20261117/Ardian9712/news-image-20261117-frontpage-v3/rank.svg)](https://make.fun/bounty/news-image-20261117/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261117)
[![reward](https://make.fun/badge/news-image-20261117/Ardian9712/news-image-20261117-frontpage-v3/reward.svg)](https://make.fun/bounty/news-image-20261117?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261117)

This entry for [make.fun news-image-20261117](https://make.fun/bounty/news-image-20261117)
copies a front-page newspaper image summing up 17 November 2026 world news to
`/output/entry.png`. It covers 43 stories across six continents, led by the
Kerch Bridge road-span collapse reported by Ukraine, Iran's drones at a US
radar in Bahrain and the US response, and Trump's first Quad summit in Manila.
A numbered, region-coloured world map and a 30-item **ALSO ON** list complete
the collage.

## Run

Use Node.js 22.18+ (or a newer release) with native TypeScript stripping;
no build step or dependencies are needed.

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
# Or use the default output directory:
node main.ts
```

`main.ts` finds the bundled image beside the script using
`fileURLToPath(import.meta.url)` and creates the selected output directory.
The output is deterministic and byte-identical to the source image. Although
named `entry.png` for the bounty, the file contains a 1024×1024 JPEG of
314,389 bytes. The program checks JPEG dimensions (at most 1024×1024), the
under-1-MiB size limit, and exact copy equality, then prints the output path,
byte count, and dimensions. It uses only local files, with no network access.

Source SHA-256:
`8f3e8b340798a457ce592c4d7754e44f9cc02df532db10d828b485cc2197f0db`

## License

MIT License — copyright 2026 Ardian9712. See [LICENSE](LICENSE).

---

[Discover make.fun](https://make.fun/r/p8atzycs)
