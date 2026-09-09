# Third-party assets

## Planet, Sun and star textures — `public/textures/*`

From **Solar System Scope**, which builds them from NASA imagery and elevation
data (Messenger, Magellan, Blue Marble, Viking/MOLA, Juno, Cassini, Voyager 2).

- Source: https://www.solarsystemscope.com/textures/
- Licence: **CC BY 4.0** — https://creativecommons.org/licenses/by/4.0/

Not modified; served as downloaded. The credit is shown on screen in the
viewer as well as here, which is what the licence asks for.

## Deep-dive figures — `public/figures/*`

Added **2026-09-09**. Six pictures from the NASA/JPL Photojournal, one per
deep-dive entry that a photograph can actually say something about.

NASA material is in the public domain and carries no obligation to credit, but
the credit line is recorded here for every one because it is the only way to
tell what is NASA's and what a third party's. **Anything the Photojournal
credits to a named person was left alone** — most of the JunoCam catalogue is
processed by citizen scientists (Björn Jónsson, Kevin M. Gill and others), and
"NASA/JPL-Caltech/SwRI/MSSS, image processing by …" is a credit with somebody's
own work in it. Every file below credits institutions only. The same rule
excluded the Photojournal's Jupiter interior graphic, which would have suited
`structure` but is credited in part to John E. Connerney.

| File | PIA | Title | Credit |
|---|---|---|---|
| `jupiter/weather.webp` | PIA04866 | Cassini Jupiter Portrait | NASA/JPL/Space Science Institute |
| `jupiter/mechanism.webp` | PIA03452 | Jupiter Polar Winds Movie | NASA/JPL/Southwest Research Institute |
| `jupiter/moons.webp` | PIA09352 | Jupiter's Moons: Family Portrait | NASA/Johns Hopkins University Applied Physics Laboratory/Southwest Research Institute |
| `jupiter/visit.webp` | PIA20704 | Juno Above Jupiter (Artist's Concept) | NASA/JPL-Caltech |
| `jupiter/research.webp` | PIA19048 | Europa's Stunning Surface | NASA/JPL-Caltech/SETI Institute |
| `jupiter/myths.webp` | PIA00014 | Jupiter Great Red Spot | NASA/JPL |

Catalogue pages are at `https://science.nasa.gov/photojournal/` — the old
`photojournal.jpl.nasa.gov/catalog/<PIA>` addresses now redirect there.

**Changes made.** Each was downloaded as JPEG and converted to WebP at quality
82, resized so the longest side is at most 660 pixels — the panel draws them
about 245 pixels wide, so 660 covers a 2× screen with room to spare. `PIA03452`
is 499×497 in the original and was converted at its own size rather than
enlarged. Nothing was cropped, recoloured or relabelled; the six together come
to 107 KB, against 868 KB for the originals.

`PIA03452` is one frame of a movie. The Photojournal also publishes it as
`.mov`, `.avi` and `.gif`; none of those is used here, and the still is the
whole of what this entry shows.

## Planetary figures — `src/data/planets.ts`

Radii, orbital distances, day and year lengths, temperatures and moon counts
are taken from NASA's planetary fact sheets. Facts are not copyrightable, and
NASA material is in the public domain regardless.
