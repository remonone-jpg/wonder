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

### Saturn — added 2026-09-10

Eight more, on the same rule: institutions only in the credit, nothing carrying
a person's name. Cassini spent thirteen years in the system, so unlike Jupiter
almost every entry that could take a photograph had one to choose from.

| File | PIA | Title | Credit |
|---|---|---|---|
| `saturn/structure.webp` | PIA09865 | Grandeur of the Rings | NASA/JPL/Space Science Institute |
| `saturn/weather.webp` | PIA21327 | Hail the Hexagon | NASA/JPL-Caltech/Space Science Institute |
| `saturn/mechanism.webp` | PIA07653 | Close to the Shepherd Moons | NASA/JPL/Space Science Institute |
| `saturn/scale.webp` | PIA17170 | One Special Day in the Life of Planet Earth — Close-Up | NASA/JPL-Caltech/Space Science Institute |
| `saturn/moons.webp` | PIA22481 | Titan Lakes | NASA/JPL-Caltech/Space Science Institute |
| `saturn/visit.webp` | PIA03883 | Artist's Conception of Cassini Saturn Orbit Insertion | NASA/JPL |
| `saturn/research.gif` | PIA07762 | Enceladus Plume Movie | NASA/JPL/Space Science Institute |
| `saturn/see.webp` | PIA03156 | A Change of Seasons on Saturn | see below |

**`see.webp` is the one that is not JPL.** Its credit line runs, in full:

> NASA and The Hubble Heritage Team (STScI/AURA); Acknowledgment: R.G. French
> (Wellesley College), J. Cuzzi (NASA/Ames), L. Dones (SwRI), and J. Lissauer
> (NASA/Ames)

Four people are named. They are named as an acknowledgment — the scientists who
planned and reduced the observation — not as the processors of the picture,
which is what the exclusion rule is aimed at, so this one was kept where the
JunoCam citizen-scientist images were not. The distinction is a judgement, and
it is recorded here rather than buried.

On the terms: NASA states that its content is generally not subject to
copyright in the United States, that it may be used for educational and
informational purposes without asking, that NASA should be acknowledged as the
source, and that it must not be used in a way that implies NASA endorses
anything. It also warns that third-party copyrighted material does appear in
its galleries and is marked as such where it does; this image carries no such
mark. STScI, which operates Hubble for NASA, publishes its material on the same
footing and asks for the credit line to be carried — which is why the whole of
it is reproduced above rather than shortened.

**Changes made.** Six were downloaded as JPEG and converted to WebP at quality
82, resized so the longest side is at most 660 pixels. `research.gif` is served
**exactly as downloaded** — it is an animated GIF and `<img>` plays it, so
converting it would have cost the motion the entry is about. Nothing was
cropped, recoloured or relabelled. The eight come to 259 KB, against 5.6 MB for
the originals — most of that being `visit`, which NASA publishes at
14400×9600.

**On `scale`, a substitution worth knowing about.** The obvious picture for
"light takes over an hour" is PIA17172, *The Day the Earth Smiled* — Saturn
backlit with Earth a pale dot beside it. It is 9000×3500, and Earth in it is
about three pixels. Drawn in this panel at 420 pixels wide, Earth would be
0.18 of a pixel: not small, absent. Cropping cannot rescue it — the crop would
have to be under 630 pixels wide to give Earth two pixels on screen, by which
point Saturn is long out of frame. PIA17170 is NASA's own close-up of that same
Earth and Moon through the E ring, where Earth lands at about 8 pixels on
screen and the Moon at 5. Saturn itself is not in it.

## Planetary figures — `src/data/planets.ts`

Radii, orbital distances, day and year lengths, temperatures and moon counts
are taken from NASA's planetary fact sheets. Facts are not copyrightable, and
NASA material is in the public domain regardless.
