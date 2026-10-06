# Self-hosted fonts

Self-hosted so `next run build` works with no network, and the site makes no
third-party font requests at runtime. See `lib/fonts.ts` for how these are wired up.

| File | Family | Axis / weight | Source |
|---|---|---|---|
| `PlusJakartaSans-Variable.woff2` | Plus Jakarta Sans | variable `wght 200..800` | Google Fonts `v12`, `latin` subset |
| `InstrumentSerif-Regular.woff2` | Instrument Serif | `400 normal` | Google Fonts `v5`, `latin` subset |
| `InstrumentSerif-Italic.woff2` | Instrument Serif | `400 italic` | Google Fonts `v5`, `latin` subset |
| `SpaceGrotesk-Variable.woff2` | Space Grotesk | variable `wght 300..700` | Google Fonts `v22`, `latin` subset |

All three are licensed under the SIL Open Font License 1.1 — see the `OFL-*.txt`
files in this directory. The OFL requires the licence text to travel with the
font files; `.txt` (not `.md`) is used deliberately because `.dockerignore`
excludes `*.md` from the build context.

## How these were obtained

Google's `css2` endpoint only serves woff2 to a modern User-Agent; the `latin`
subset is the last `@font-face` block in the response (the one whose
`unicode-range` starts `U+0000-00FF`).

```bash
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
curl -sA "$UA" 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800'
curl -sA "$UA" 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1'
curl -sA "$UA" 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700'
# then curl -sLo <file> <gstatic url from the matching latin block>
```

Licence texts:

```bash
curl -sLo OFL-PlusJakartaSans.txt https://raw.githubusercontent.com/google/fonts/main/ofl/plusjakartasans/OFL.txt
curl -sLo OFL-InstrumentSerif.txt https://raw.githubusercontent.com/google/fonts/main/ofl/instrumentserif/OFL.txt
curl -sLo OFL-SpaceGrotesk.txt https://raw.githubusercontent.com/google/fonts/main/ofl/spacegrotesk/OFL.txt
```

Instrument Serif has no variable weight axis upstream, so it ships as two
static files (regular + italic) rather than one variable file.
