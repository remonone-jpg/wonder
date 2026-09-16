# Third-party assets

## Planet, Sun and star textures — `public/textures/*`

From **Solar System Scope**, which builds them from NASA imagery and elevation
data (Messenger, Magellan, Blue Marble, Viking/MOLA, Juno, Cassini, Voyager 2).

- Source: https://www.solarsystemscope.com/textures/
- Licence: **CC BY 4.0** — https://creativecommons.org/licenses/by/4.0/

Not modified; served as downloaded. The credit is shown on screen in the
viewer as well as here, which is what the licence asks for.

## What we take, and what we leave

Restated **2026-09-10**, when the pictures stopped being planets. The four
planet sets came entirely from the NASA/JPL Photojournal, where a rule of
"institutions only in the credit" was easy to keep. Outside the solar system
it is not: nearly every Webb and Hubble release names the people at STScI who
assembled the picture from the raw frames.

- **Taken** — a credit that is a string of institutions.
- **Taken** — researchers named after `Acknowledgment:`, or named inline with
  an affiliation. These are the people who planned and reduced the
  observation, not the people who processed the picture.
- **Taken** — image processing credited to a named person **with their
  institution beside it**: `J. DePasquale (STScI)`, `NASA/CXC/SAO/K. Divona`,
  `NASA/Chris Gunn`.
- **Left** — processing credited to a person with no institution.

The line is drawn at the affiliation because that is where the work changes
hands. A JunoCam image marked "image processing by citizen scientist Björn
Jónsson" is a volunteer's own work, made on his own time from data NASA
published for anyone to take; whatever rights attach to it are his. An image
marked `J. DePasquale (STScI)` was assembled by a staff member of the
institute NASA and ESA pay to operate the telescope, as part of the job — it
is the institution's work with a person's name on it as a courtesy. STScI
publishes those images itself as free to use.

The distinction is a judgement, not a legal finding, so every credit below is
reproduced in full rather than summarised.

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

### Star life — added 2026-09-10 — `public/figures/star-life/`

The first set from outside the solar system, for the "별의 일생" entry of the
second layer. Seven of that entry's fourteen sections carry one; the other
seven are diagrams still to be drawn. An eighth file is held in reserve.

Credits in full, exactly as each source prints them:

| File | Title | Source | Credit |
|---|---|---|---|
| `birth.webp` | NIRCam Image of the "Cosmic Cliffs" in Carina | [ESA/Webb weic2205a](https://esawebb.org/images/weic2205a/) | NASA, ESA, CSA, and STScI |
| `death.webp` | Southern Ring Nebula (NIRCam Image) | [ESA/Webb weic2207b](https://esawebb.org/images/weic2207b/) | NASA, ESA, CSA, STScI, and the Webb ERO Production Team |
| `supernova.webp` | The Crab Nebula | [ESA/Webb weic2326a](https://esawebb.org/images/weic2326a/) | NASA, ESA, CSA, STScI, T. Temim (Princeton University) |
| `unknown.webp` | Protostar L1527 | [ESA/Webb weic2219a](https://esawebb.org/images/weic2219a/) | NASA, ESA, CSA, and STScI, J. DePasquale (STScI) |
| `life.webp` | Westerlund 2 — Hubble's 25th anniversary image | [ESA/Hubble heic1509a](https://esahubble.org/images/heic1509a/) | NASA, ESA, the Hubble Heritage Team (STScI/AURA), A. Nota (ESA/STScI), and the Westerlund 2 Science Team |
| `ushere.webp` | Periodic Table of the Elements: Origins of the Elements | [NASA SVS 13873](https://svs.gsfc.nasa.gov/13873/) | NASA's Goddard Space Flight Center |
| `observe.webp` | The Beauty of Webb's Mirrors | [NASA SVS 12775](https://svs.gsfc.nasa.gov/12775/) | NASA's Scientific Visualization Studio |
| `whatis.webp` | Solar Dynamics Observatory, HMI intensitygram, full disk | [SDO](https://sdo.gsfc.nasa.gov/) | NASA/SDO |

Two of the eight name a person. `T. Temim (Princeton University)` led the Crab
observation and `A. Nota (ESA/STScI)` the Westerlund 2 one — researchers, taken
under the rule above. `J. DePasquale (STScI)` processed the L1527 picture, and
is taken because the institute is beside the name. The Southern Ring line names
no one at all — it is the cleanest kind under the rule, institutions and a
production team.

**`death.webp` was replaced on 2026-09-14.** It held the Crab Nebula, a
supernova remnant, while the entry it sits in is titled "태양은 어떻게 끝나나"
and describes the light-star path. The Sun will not go that way. The Southern
Ring Nebula, a planetary nebula, is what that passage actually describes. The
Crab was not deleted — it kept its credit and moved to `supernova.webp`, ready
for a passage about the heavy path. Nothing references it yet.

The Goddard periodic table lists its makers on the release page — Scott
Wiessinger and Ashley Balzer as illustrators, Jennifer Johnson (Ohio State) as
the scientist — but the line it asks to be credited with is the institution
alone, and that is the line reproduced above.

**Changes made.** Each was downloaded at the source's largest published size
and converted to WebP at quality 82, resized so the width is at most 660
pixels. Nothing was cropped, recoloured or relabelled. The Southern Ring came
from the 4,833 × 4,501 JPEG and is 660 × 615 here, 36 KB against 3.1 MB. The
eight come to 352 KB, against 71 MB for the originals — `birth` alone is
14,575 pixels wide as published.

`whatis.webp` is a live full-disk image rather than a dated release: SDO
photographs the whole Sun every 12 seconds and publishes the newest frame at a
fixed address. This one was taken from that address on **2026-09-10**. It is
the HMI intensitygram — the Sun in visible light, the way an eye would see it
— rather than one of the coloured ultraviolet channels.

### Sun — added 2026-09-16 — `public/figures/sun/`

Nine of the Sun entry's twenty sections carry a picture. It is the first set
that reaches outside NASA and ESA: two come from the National Solar
Observatory, one from ESO, and one from a Korean museum. Every one of them
prints its own credit line beside the image, and those lines are reproduced
below word for word.

| File | Entry | Title / subject | Source | Credit, exactly as printed |
|---|---|---|---|---|
| `structure.webp` | 구조 | DKIST first-light image of solar granulation | [NSO press release, 29 Jan 2020](https://nso.edu/press-release/inouye-solar-telescope-first-light/) | Credit: NSO/AURA/NSF |
| `weather.webp` | 날씨 | X4.9 flare of 24 Feb 2014, AIA 131 Å | [NASA SVS 11493](https://svs.gsfc.nasa.gov/11493/) | Credit: NASA/SDO |
| `atmosphere.webp` | 대기와 하늘 | 2017 Total Solar Eclipse | [NASA AFRC2017-0233-007](https://images.nasa.gov/details/AFRC2017-0233-007) | Credit: (NASA/Carla Thomas) |
| `magnetism.webp` | 보이지 않는 껍질 | DKIST first image of a sunspot, 28 Jan 2020 | [NSO press release, 3 Dec 2020](https://nso.edu/press-release/inouye-solar-telescope-releases-first-image-of-a-sunspot/) | Image credit: NSO/AURA/NSF |
| `visit.webp` | 가 본 것들 | Parker Solar Probe in the clean room, 6 Jul 2018 | [NASA SVS 12997](https://svs.gsfc.nasa.gov/12997/) | Credit: NASA/Johns Hopkins APL/Ed Whitman |
| `research.webp` | 지금 연구 중 | Solar Orbiter's tilted view of the Sun, 23 Mar 2025 | [ESA Multimedia, 11 Jun 2025](https://www.esa.int/ESA_Multimedia/Images/2025/06/Solar_Orbiter_s_tilted_view_of_the_Sun) | ESA & NASA/Solar Orbiter/EUI Team |
| `see.webp` | 찾아보기 | Portrait for the #showusyourspecs campaign, 20 Dec 2023 | [NASA GRC-2023-C-10990](https://images.nasa.gov/details/GRC-2023-C-10990) | Photo Credit: (NASA/Sara Lowthian-Hanna) |
| `culture.webp` | 말 속의 흔적 | 휴대용 앙부일구 (portable sundial, 1871) | [국립중앙박물관 소장품 2399](https://www.museum.go.kr/MUSEUM/contents/M0502000000.do?schM=view&searchId=search&relicId=2399) | 국립중앙박물관이(가) 창작한 휴대용 앙부일구 저작물은 공공누리 "출처표시" 조건에 따라 이용할 수 있습니다. |
| `art.webp` | 이야기 속에서 | The 1919 solar eclipse, un-annotated restoration | [ESO 1919-solar-eclipse](https://www.eso.org/public/images/1919-solar-eclipse/) | Credit: ESO/Landessternwarte Heidelberg-Königstuhl/F. W. Dyson, A. S. Eddington, & C. Davidson |

**Four of the nine name a person, and each was checked against the rule.**
`Carla Thomas` and `Sara Lowthian-Hanna` are NASA staff photographers and the
credit puts NASA in front of the name. `Ed Whitman` photographed the spacecraft
for the Johns Hopkins Applied Physics Laboratory, and the credit names the lab.
The ESO line names `F. W. Dyson, A. S. Eddington, & C. Davidson` — the three
authors of the 1919 result — beside the observatory that scanned the plate.
None is an unaffiliated individual, which is what the exclusion is aimed at.

**On the two that are not NASA or ESA.** NSO publishes under
[CC BY 4.0](https://nso.edu/about/image-use-policy/) and asks that the credit
be shown "in a clear and readable manner to all users, with the wording
unaltered (for example: NSO/AURA/NSF)". Both NSO captions therefore carry
`NSO/AURA/NSF` inside the on-screen caption, not only here. The museum's line
is 공공누리 제1유형 — free use including commercial and derivative, on
condition the source is named — and the caption names 국립중앙박물관. ESO
material is CC BY 4.0; ESA's is CC BY-SA 3.0 IGO or the ESA Standard Licence.

**Two were cropped, which earlier sets were not.** `see.webp` came from a
5,504 × 8,256 portrait and the panel takes 1:1 to 2:1, so a 5,504 × 5,504
square was taken from 900 pixels down — head, glasses and shirt all inside it.
`atmosphere.webp` came from a 5,101 × 3,401 frame in which the eclipsed Sun
filled about a third of the width; a 3,200 × 3,200 square centred on the disc
was taken so that a five-year-old can actually see the corona and the pink
chromosphere. Nothing else was cropped, and nothing was recoloured or
relabelled.

**On colour.** Four of the nine are not the colour an eye would see, and each
says so in its own caption. The two DKIST images were taken at 789 nm and
530 nm and NSO applies a warm palette — NSO says this itself in the sunspot
caption. The SDO frame is 131 Å ultraviolet, rendered teal. The Solar Orbiter
frame is extreme ultraviolet, rendered gold. The rule the book follows for
false colour is the one already set in the nebula entry of the second layer.

**Changes made.** Each was downloaded at the largest size the source publishes
that a 660-pixel render can use, and converted to WebP at quality 82, resized
to 660 pixels wide. The ESO original is 23,800 × 14,191 and 218 MB; the
4,000 × 2,385 publication JPEG was used instead, since the difference is
invisible at 660. The nine come to 432 KB, `structure.webp` alone being 139 KB
— granulation is texture from edge to edge and compresses badly.

**Entries deliberately left without a picture.** `달들` was going to carry
PIA01341, the JPL solar system montage, and did not: that montage renders
Neptune in the over-enhanced blue that this book's own `오해와 진실` and
`이야기 속에서` entries describe as an artefact of image processing, so it
would have contradicted the text two entries away. It is also 2,000 × 2,445,
outside the panel's ratio. `발견의 역사` was going to carry a seventeenth-
century sunspot drawing and did not: no scan was found whose holding
institution prints a credit line, and the rule here is to leave the space empty
rather than guess at one. The remaining nine entries — 숫자로 보면, 작동 원리,
얼마나 먼가, 태어난 이야기, 궤도와 이웃, 앞으로의 계획, 사람이 산다면,
이름의 유래, 오해와 진실 — are about reasoning rather than appearance, and a
picture would have decorated them rather than shown anything.

### Earth — added 2026-09-16 — `public/figures/earth/`

The first set written under a changed goal: **every entry that can carry a
picture carries one**, rather than only the ones where a photograph is
obviously the point. Nineteen of the Earth entry's twenty sections have one.
That meant reaching past photographs into institution-made diagrams — a USGS
cutaway, a USGS volume comparison, a NASA solstice rendering, a NASA
temperature map — and into a museum collection.

| File | Entry | Title / subject | Source | Credit, exactly as printed |
|---|---|---|---|---|
| `structure.webp` | 구조 | Cutaway views showing the internal structure of the Earth | [USGS](https://www.usgs.gov/media/images/cutaway-views-showing-internal-structure-earth-left) | By Volcano Hazards Program · Sources/Usage: Public Domain |
| `numbers.webp` | 숫자로 보면 | Comparison of Earth's water volumes | [USGS Water Science School](https://www.usgs.gov/special-topics/water-science-school/science/how-much-water-there-earth) | Sources/Usage: Public Domain — image carries "Jeffrey Kwang · Data from: USGS Water Science School, DOI 10.1029/2019EA000658, NASA" |
| `weather.webp` | 날씨 | Hurricane Helene pictured from the space station | [NASA iss072e001649](https://images.nasa.gov/details/iss072e001649) | NASA |
| `atmosphere.webp` | 대기와 하늘 | Sunset on the Indian Ocean, Expedition 23 | [NASA iss023e057948](https://images.nasa.gov/details/iss023e057948) | NASA |
| `magnetism.webp` | 보이지 않는 껍질 | The aurora borealis blankets the Earth | [NASA iss072e159172](https://images.nasa.gov/details/iss072e159172) | NASA |
| `mechanism.webp` | 작동 원리 | The Apollo 15 Lunar Laser Ranging Retroreflector | [NASA PIA13037](https://images.nasa.gov/details/PIA13037) | NASA/GSFC/Arizona State University |
| `scale.webp` | 얼마나 먼가 | Proxima Centauri | [ESA/Hubble potw1343a](https://esahubble.org/images/potw1343a/) | Credit: ESA/Hubble & NASA |
| `moons.webp` | 달들 | The Moon — Clementine composite | [NASA GSFC_20171208_Archive_e001982](https://images.nasa.gov/details/GSFC_20171208_Archive_e001982) | Credit: NASA |
| `origin.webp` | 태어난 이야기 | Comet on 15 March 2016 – NavCam | [ESA Multimedia](https://www.esa.int/ESA_Multimedia/Images/2016/03/Comet_on_15_March_2016_NavCam) | ESA/Rosetta/NavCam – CC BY-SA IGO 3.0 |
| `orbit.webp` | 궤도와 이웃 | Solstice Animations — summer solstice still | [NASA SVS 14366](https://svs.gsfc.nasa.gov/14366/) | Please give credit for this item to: NASA's Goddard Space Flight Center |
| `visit.webp` | 가 본 것들 | Apollo 8, Earth over the horizon of the moon | [NASA as08-14-2383](https://images.nasa.gov/details/as08-14-2383) | NASA |
| `research.webp` | 지금 연구 중 | Glass sponge and *Deep Discoverer*, EX2606 Dive 12 | [NOAA Ocean Exploration](https://oceanexplorer.noaa.gov/multimedia/sponge-and-deep-discoverer/) | NOAA Ocean Exploration, 2026 American Samoa ROV + Mapping Exploration |
| `see.webp` | 찾아보기 | Supermoon Lunar Eclipse, 17 Sep 2024 | [NASA GRC-2024-C-10128](https://images.nasa.gov/details/GRC-2024-C-10128) | Photo Credit: (NASA/Sara Lowthian-Hanna) |
| `future.webp` | 앞으로의 계획 | Global Temperature Anomalies from 1880 to 2025 — 2025 map | [NASA SVS 5603](https://svs.gsfc.nasa.gov/5603/) | Please give credit for this item to: NASA's Scientific Visualization Studio |
| `livehere.webp` | 사람이 산다면 | NASA Captures 'EPIC' Earth Image, 6 Jul 2015 | [NASA GSFC_20171208_Archive_e000678](https://images.nasa.gov/details/GSFC_20171208_Archive_e000678) | NASA |
| `history.webp` | 발견의 역사 | 혼천의 (armillary sphere, 1871) | [국립중앙박물관 소장품 36003317](https://www.museum.go.kr/MUSEUM/contents/M0502000000.do?schM=view&searchId=search&relicId=36003317) | 국립중앙박물관이(가) 창작한 혼천의 저작물은 공공누리 "출처표시" 조건에 따라 이용할 수 있습니다. |
| `culture.webp` | 말 속의 흔적 | Pale Blue Dot Revisited | [NASA PIA23645](https://images.nasa.gov/details/PIA23645) | NASA/JPL-Caltech |
| `myths.webp` | 오해와 진실 | Night lights of Seoul from the space station | [NASA iss062e082060](https://images.nasa.gov/details/iss062e082060) | NASA |
| `art.webp` | 이야기 속에서 | Apollo 17 "Blue Marble" | [NASA as17-148-22727](https://images.nasa.gov/details/as17-148-22727) | NASA |

**The one entry left empty is `이름의 유래`.** It is about where the words
地球 and *Earth* come from and why Earth is the only planet not named after a
god. The object that would have carried it is 곤여만국전도, the 1602 world map
that brought the round-Earth vocabulary into Korea — the entry names it. It is
held by 서울대학교 박물관, not by a collection that prints a reusable credit
line, and nothing was found at 국립중앙박물관 or the Library of Congress whose
credit could be quoted. The rule here is to leave the space empty rather than
guess at a credit, so it is empty.

**Names in the credits.** `Sara Lowthian-Hanna` is a NASA staff photographer
and the credit puts NASA in front of the name. `Jeffrey Kwang` appears inside
the USGS water graphic beside the USGS logo, which is the affiliation. The SVS
items name their animators in the full credits (`Krystofer Kim (KBR Wyle
Services, LLC)`, `Robert B. Schmunk (NASA/GSFC GISS)`) but each asks to be
credited to the institution alone, and that is the line reproduced above.

**Three were cropped.** `numbers.webp` came from a 1,336 × 2,004 portrait; a
1,336 × 1,336 square was taken from 668 pixels down, which keeps every water
sphere, the USGS logo and the credit block, and the lower curve of the globe.
`moons.webp` came from a 1,536 × 864 frame in which the Moon filled the middle
third; an 864 × 864 square was taken from 336 pixels in. `see.webp` came from a
1,920 × 1,280 frame with a small Moon; a 1,000 × 1,000 square was taken at
(437, 160) so that the curve of Earth's shadow is legible. Nothing else was
cropped, and nothing was recoloured or relabelled.

**On colour and on drawings.** `future.webp` is a data map — the reds and blues
are assigned to temperature differences, and the caption says so. `orbit.webp`
is a rendering, not a photograph, and the caption says so. `moons.webp` and
`numbers.webp` are composites assembled from many frames or from data, and
their captions say so. Four of the nineteen carry burnt-in English labels
(`structure`, `numbers`, `mechanism`, `future`); each caption notes that the
lettering is English so a Korean reader is not left puzzling at it.

**Changes made.** Each was downloaded at the largest size the source publishes,
converted to WebP at quality 82 and resized to 660 pixels wide. `scale.webp` is
the exception: ESA/Hubble publishes it at 604 × 592, so it was converted at its
own size rather than enlarged, the same treatment PIA03452 got in the Jupiter
set. The nineteen come to 528 KB.

### Mars — added 2026-09-16 — `public/figures/mars/`

Eighteen of the twenty. Mars is the best-photographed body in this book after
Earth — five rovers, a helicopter and half a dozen orbiters — so unlike the Sun
almost every entry had a real photograph to choose from rather than a diagram.

| File | Entry | Title / subject | Source | Credit, exactly as printed |
|---|---|---|---|---|
| `structure.webp` | 구조 | Olympus Mons | [NASA PIA00300](https://images.nasa.gov/details/PIA00300) | NASA/JPL/USGS |
| `numbers.webp` | 숫자로 보면 | Mars Daily Global Image from April 1999 | [NASA PIA02653](https://images.nasa.gov/details/PIA02653) | NASA/JPL/MSSS |
| `weather.webp` | 날씨 | Mars Before and After Dust Storm | [NASA PIA22487](https://images.nasa.gov/details/PIA22487) | NASA/JPL-Caltech/MSSS |
| `atmosphere.webp` | 대기와 하늘 | Sunset in Mars Gale Crater | [NASA PIA19400](https://images.nasa.gov/details/PIA19400) | NASA/JPL-Caltech/MSSS/Texas A&M Univ. |
| `magnetism.webp` | 보이지 않는 껍질 | MAVEN — water escape from Mars (illustration) | [NASA GSFC_20171208_Archive_e000197](https://images.nasa.gov/details/GSFC_20171208_Archive_e000197) | NASA |
| `mechanism.webp` | 작동 원리 | Sundial Lands on Mars | [NASA PIA05018](https://images.nasa.gov/details/PIA05018) | NASA/JPL/Cornell University |
| `scale.webp` | 얼마나 먼가 | The Goldstone Solar System Radar at Sunset | [NASA PIA26150](https://images.nasa.gov/details/PIA26150) | NASA/JPL-Caltech |
| `moons.webp` | 달들 | Phobos from 6,800 Kilometers Color | [NASA PIA10368](https://images.nasa.gov/details/PIA10368) | NASA/JPL-Caltech/University of Arizona |
| `origin.webp` | 태어난 이야기 | Sample Collection and Rock Analysis at Wildcat Ridge | [NASA PIA24928](https://images.nasa.gov/details/PIA24928) | NASA/JPL-Caltech/ASU/MSSS |
| `visit.webp` | 가 본 것들 | High-Resolution Still Image of Perseverance's Landing | [NASA PIA24428](https://images.nasa.gov/details/PIA24428) | NASA/JPL-Caltech |
| `research.webp` | 지금 연구 중 | Perseverance Finds a Rock With 'Leopard Spots' | [NASA PIA26368](https://images.nasa.gov/details/PIA26368) | NASA/JPL-Caltech/MSSS |
| `see.webp` | 찾아보기 | Mars near opposition, 12 May 2016 | [ESA/Hubble heic1609a](https://esahubble.org/images/heic1609a/) | Credit: NASA, ESA, the Hubble Heritage Team (STScI/AURA), J. Bell (ASU), and M. Wolff (Space Science Institute) |
| `future.webp` | 앞으로의 계획 | Ingenuity's Successful Fifth Flight | [NASA PIA24647](https://images.nasa.gov/details/PIA24647) | NASA/JPL-Caltech |
| `livehere.webp` | 사람이 산다면 | Vegetables Grown Inside the CHAPEA Mission 2 Habitat | [NASA jsc2026e403177](https://images.nasa.gov/details/jsc2026e403177) | Credit: NASA |
| `history.webp` | 발견의 역사 | First TV Image of Mars | [NASA PIA14032](https://images.nasa.gov/details/PIA14032) | NASA/JPL-Caltech/Dan Goods |
| `culture.webp` | 말 속의 흔적 | Ares 3 and The Martian | [NASA PIA19306](https://images.nasa.gov/details/PIA19306) | NASA/JPL-Caltech/University of Arizona |
| `myths.webp` | 오해와 진실 | Highest-Resolution View of Face | [NASA PIA03225](https://images.nasa.gov/details/PIA03225) | NASA/JPL/MSSS |
| `art.webp` | 이야기 속에서 | First Color Image From Viking Lander 1 | [NASA PIA00563](https://images.nasa.gov/details/PIA00563) | NASA/JPL |

**Two entries are empty.** `궤도와 이웃` is about the eccentricity of the Mars
orbit and about Kepler working it out from Tycho's Mars observations; what that
needs is an orbit diagram or a page of Kepler, and no institution-credited scan
of either was found that the entry's own argument could stand behind. The
nearest NASA candidate, PIA01252, is three Hubble globes showing different
longitudes — that is rotation, not orbit, so it would have illustrated the
wrong thing. `이름의 유래` is about the words *Mars*, 火星 and 화요일; a statue
of the god would fit, and nothing was found in a museum collection printing a
reusable credit line.

**One was cropped.** `history.webp` came from a 1,209 × 1,280 portrait and the
panel takes 1:1 to 2:1, so a 1,209 × 1,209 square was taken from 35 pixels down.
`future.webp` was also cropped, from 1,280 × 720 to a 720 × 720 square starting
at x = 229, because Ingenuity is a dark speck and a full-width render made it
almost invisible. Nothing else was cropped, recoloured or relabelled.

**Renderings, composites and English lettering, each named in its caption.**
`magnetism.webp` is an artist's rendering of atmospheric escape, not a
photograph. `numbers.webp` is a day's worth of orbits stitched together, and
`weather.webp` and `origin.webp` are mosaics. `mechanism.webp` carries burnt-in
English ("Pancam Calibration Target", "High Sun", "Low Sun"), and its caption
says the lettering is English.

**Changes made.** Each was downloaded at the largest size the source publishes,
converted to WebP at quality 82, resized to 660 pixels wide. `mechanism.webp`
(640 × 480) and `art.webp` (563 × 512) are published smaller than 660 and were
converted at their own size rather than enlarged. The eighteen come to 703 KB.

### Sun, second pass — added 2026-09-16 — `public/figures/sun/`

Four more against the changed goal of filling every entry. Seven of the Sun's
twenty are still empty and are listed below with the reason for each.

| File | Entry | Title / subject | Source | Credit, exactly as printed |
|---|---|---|---|---|
| `scale.webp` | 얼마나 먼가 | Two Interstellar Travelers | [NASA PIA22835](https://images.nasa.gov/details/PIA22835) | NASA/JPL-Caltech |
| `orbit.webp` | 궤도와 이웃 | Tracing the Arms of our Milky Way Galaxy | [NASA PIA19341](https://images.nasa.gov/details/PIA19341) | NASA/JPL-Caltech/Federal University of Rio Grande do Sul |
| `origin.webp` | 태어난 이야기 | Pillars of Creation (NIRCam Image) | [ESA/Webb weic2216a](https://esawebb.org/images/weic2216a/) | Credit: NASA, ESA, CSA, STScI; J. DePasquale, A. Koekemoer, A. Pagan (STScI) |
| `myths.webp` | 오해와 진실 | SDO HMI intensitygram, full disk | [SDO](https://sdo.gsfc.nasa.gov/) | NASA/SDO |

`myths.webp` is a second live full-disk frame from the same SDO address the
`star-life/whatis.webp` frame came from, taken on **2026-09-16** rather than
2026-09-10, so the two entries do not show the identical Sun. It is the
visible-light intensitygram precisely because the entry's point is that the Sun
is white, not yellow.

Both ESA/Webb and ESA/Hubble state that crediting the image with the full credit
line in a visible way is mandatory for free use, so those two credit lines are
reproduced inside the on-screen caption as well as here.

**The seven still empty, and why.** `숫자로 보면` wants a Sun-to-Earth size
comparison and no institution-credited one was found. `작동 원리` wants
differential rotation, which is a measurement rather than a picture — a single
frame cannot show that the equator turns faster than the poles. `달들` wants a
solar system orbit diagram, and the one obvious NASA candidate is the montage
already refused in the Earth set for rendering Neptune in over-enhanced blue.
`앞으로의 계획` wants the Vigil or PUNCH spacecraft, `사람이 산다면` wants
sunlight doing work on Earth, `발견의 역사` wants a large 앙부일구, and
`이름의 유래` wants a sun symbol or a Ra relief; for each, nothing was found
whose credit line could be read and quoted within this pass. They are marked
here so the next pass starts from a list rather than from scratch.

**Changes made.** Same treatment as the rest: largest published size, WebP at
quality 82, 660 pixels wide, nothing cropped. The four come to 207 KB.

## Diagrams drawn for this book — `public/figures/*/*.svg`

Added **2026-09-16**. Some entries are about a relation rather than a sight:
how big one thing is beside another, how an orbit is shaped, how long a day is
against a year. For those, hunting for someone else's picture was the wrong
move — the diagram that says exactly what the entry says can be drawn, in
Korean, at true proportions, in a few hundred bytes of SVG.

| File | Entry | What it shows |
|---|---|---|
| `sun/numbers.svg` | 태양 숫자로 보면 | Sun and Earth at true relative size; Earth is a 3-pixel dot beside a 350-pixel Sun |
| `sun/mechanism.svg` | 태양 작동 원리 | Differential rotation — arrow length by latitude, 25 days at the equator against 34 near the poles |
| `sun/moons.svg` | 태양 달들 | Eight orbits at true relative radius, with the inner four blown up in an inset because they vanish at that scale |
| `sun/livehere.svg` | 태양 사람이 산다면 | Sunlight → plants → herbivore → carnivore |
| `mars/orbit.svg` | 화성 궤도와 이웃 | Earth and Mars orbits at true relative size and eccentricity, with perihelion and aphelion marked |
| `mercury/numbers.svg` | 수성 숫자로 보면 | Earth, Mercury and the Moon at true relative size |
| `mercury/mechanism.svg` | 수성 작동 원리 | Bars at true ratio — 59 days to turn, 88 to orbit, 176 until sunrise |
| `mercury/orbit.svg` | 수성 궤도와 이웃 | The most eccentric orbit in the solar system, drawn at e = 0.2056 with the Sun at a focus |
| `venus/numbers.svg` | 금성 숫자로 보면 | Earth and Venus at true relative size — a 5 % difference |
| `venus/mechanism.svg` | 금성 작동 원리 | 243-day rotation against a 225-day year, and the two spin directions |
| `venus/orbit.svg` | 금성 궤도와 이웃 | Venus, Earth and Mars eccentricities drawn at one size so the Sun's drift off centre is visible |

**Credit: drawn for this book. Data from the NASA planetary fact sheets** (the
same numbers `src/data/planets.ts` carries) — radii, orbital distances,
eccentricities, rotation and orbital periods. Facts are not copyrightable and
the NASA sheets are public domain; the drawings are this project's own.

Every one of these captions opens by saying `이 책이 그린 도해입니다` so a
reader never mistakes a drawing for a photograph, and each says which parts are
true to scale and which were enlarged to be visible — planet discs in
`sun/moons.svg`, for instance, are not.

Each is plain SVG with no external fonts or images, 660 pixels wide, between
1.2 KB and 3.3 KB. Every aspect ratio is inside the 1:1–2:1 the panel takes.

### Mercury — added 2026-09-16 — `public/figures/mercury/`

Five photographs beside the three diagrams above.

| File | Entry | Title / subject | Source | Credit, exactly as printed |
|---|---|---|---|---|
| `structure.webp` | 구조 | Mercury Globe: 0°N, 180°E | [NASA PIA15162](https://images.nasa.gov/details/PIA15162) | NASA/Johns Hopkins University Applied Physics Laboratory/Carnegie Institution of Washington |
| `research.webp` | 지금 연구 중 | MESSENGER Finds New Evidence for Water Ice at Mercury's Poles | [NASA GSFC_20171208_Archive_e001634](https://images.nasa.gov/details/GSFC_20171208_Archive_e001634) | NASA/Johns Hopkins University Applied Physics Laboratory/Carnegie Institution of Washington |
| `see.webp` | 찾아보기 | Mercury Solar Transit, 11 Nov 2019 | [NASA NHQ201911110005](https://images.nasa.gov/details/NHQ201911110005) | NASA/Bill Ingalls |
| `visit.webp` | 가 본 것들 | Best images from BepiColombo's sixth Mercury flyby | [ESA Multimedia, 8 Jan 2025](https://www.esa.int/ESA_Multimedia/Images/2025/01/Best_images_from_BepiColombo_s_sixth_Mercury_flyby) | ESA/BepiColombo/MTM |
| `history.webp` | 발견의 역사 | Outgoing Hemisphere (Mariner 10, 1974) | [NASA PIA02418](https://images.nasa.gov/details/PIA02418) | NASA/JPL/Northwestern University |

**Two were cropped.** `history.webp` came from a 775 × 1,023 portrait; a
775 × 775 square was taken from 124 pixels down. `visit.webp` came from a
7,423 × 2,469 triptych — three monitoring-camera frames side by side, 3:1 — and
the middle frame was taken whole as a 2,469 × 2,469 square.

`research.webp` is a data overlay: the yellow marks permanently shadowed crater
floors and the red marks radar-bright deposits, both assigned by the science
team, and the map carries English lettering. Its caption says so.

### Venus — added 2026-09-16 — `public/figures/venus/`

One photograph beside the three diagrams above.

| File | Entry | Title / subject | Source | Credit, exactly as printed |
|---|---|---|---|---|
| `structure.webp` | 구조 | Venus — 3-D Perspective View of Maat Mons | [NASA PIA00106](https://images.nasa.gov/details/PIA00106) | NASA/JPL |

This is a computer-generated perspective built from Magellan radar, with the
vertical scale greatly exaggerated and the colour taken from Venera surface
images. All three of those facts are in its caption, because a reader who takes
it for a photograph would come away with the wrong idea of what Venus looks
like.

**Mercury stands at 8 of 20 and Venus at 4 of 20.** The photograph pass for
both was stopped rather than rushed; the entries still empty are listed in the
report for this batch and are the starting list for the next one.

## Planetary figures — `src/data/planets.ts`

Radii, orbital distances, day and year lengths, temperatures and moon counts
are taken from NASA's planetary fact sheets. Facts are not copyrightable, and
NASA material is in the public domain regardless.
