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
| `saturn/weather.webp` | PIA21348 | Circles and Hexagons | NASA/JPL-Caltech/Space Science Institute |
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

**2026-09-17 — 지형 편을 가르며 여덟 개를 더함.** 지도 위 점마다 제 편을
갖도록 스무 편을 스물여덟으로 갈랐고, 새 편에 그림을 붙였다. 사진으로 될
것은 사진으로(옐로스톤·만리장성), 실물 사진을 구할 수 없는 것은 이 책이
그린 도해로 채웠다 — 시추공 깊이, 해구 깊이, 지구 연표, 에라토스테네스의
각도, 푸코 진자, 지구와 달의 보존 차이가 그것이다.

| File | Entry | Title / subject | Source | Credit, exactly as printed |
|---|---|---|---|---|
| `yellowstone.webp` | 앞날 (옐로스톤) | Yellowstone Park, ASTER 2001-07-02, simulated natural colour | [NASA PIA03875](https://images.nasa.gov/details/PIA03875) | NASA/GSFC/METI/ERSDAC/JAROS, and U.S./Japan ASTER Science Team |
| `greatwall.webp` | 오해와 진실 (만리장성) | 궤도에서 찍힌 것이 확인된 첫 만리장성 사진, 400mm 망원렌즈 | [NASA ISS010-E-08497](https://images.nasa.gov/details/iss010e08497) | NASA |
| `kola.svg` | 구조 (콜라 시추공) | 이 책이 그린 도해 — 시추공 12km 와 지구 반지름 | 자체 제작 | — |
| `mariana.svg` | 숫자 (마리아나 해구) | 이 책이 그린 도해 — 에베레스트를 거꾸로 넣은 깊이 비교 | 자체 제작 | — |
| `jackhills.svg` | 태어난 이야기 (잭힐스) | 이 책이 그린 도해 — 지구 연표 | 자체 제작 | — |
| `acasta.svg` | 태어난 이야기 (아카스타) | 이 책이 그린 도해 — 지구와 달의 보존 차이 | 자체 제작 | — |
| `eratosthenes.svg` | 맨눈으로 보기 (알렉산드리아) | 이 책이 그린 도해 — 그림자 각도 7.2° | 자체 제작 | — |
| `foucault.svg` | 역사 (파리 판테온) | 이 책이 그린 도해 — 추의 면과 도는 바닥 | 자체 제작 | — |

`myths.webp`(서울의 밤)는 새로 갈라 나온 「밤에 더 잘 보이는 것」 편으로
옮겼고, 원래 있던 만리장성 편에는 위의 `greatwall.webp` 를 새로 붙였다.

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

Mars now runs to twenty-eight entries — the landform entries were split so each
map pin has its own — and every one carries a figure. Mars is the
best-photographed body in this book after
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
| `origin.webp` | 태어난 이야기 | Nanedi Valles (THEMIS, 적외선 흑백) | [NASA PIA11309](https://images.nasa.gov/details/PIA11309) | NASA/JPL/ASU |
| `jezero.webp` | 태어난 이야기 (예제로) | Sample Collection and Rock Analysis at Wildcat Ridge | [NASA PIA24928](https://images.nasa.gov/details/PIA24928) | NASA/JPL-Caltech/ASU/MSSS |
| `tharsis.webp` | 구조 (타르시스) | Tharsis — Viking mosaic, 흑백에 저해상도 컬러를 겹친 합성 | [NASA PIA00408](https://images.nasa.gov/details/PIA00408) | NASA/JPL/USGS |
| `marineris.webp` | 구조 (발레스 마리네리스) | Valles Marineris Hemisphere — Viking 102장 모자이크, 색 차이 약 2배 강조 | [NASA PIA00003](https://images.nasa.gov/details/PIA00003) | NASA/JPL/USGS |
| `hellas.svg` | 구조 (남북 이분성) | 이 책이 그린 도해 — 남북 단면, 높낮이 부풀림 | 자체 제작 | — |
| `polar-north.webp` | 날씨 (북극) | Northern Ice Cap of Mars — 두 장비 자료 합성 | [NASA PIA13163](https://images.nasa.gov/details/PIA13163) | NASA/JPL/MSSS |
| `polar-south.webp` | 날씨 (남극) | The Changing Ice Cap of Mars — 스위스 치즈 지형 | [NASA PIA22870](https://images.nasa.gov/details/PIA22870) | NASA/JPL-Caltech/University of Arizona |
| `gale.webp` | 태어난 이야기 (게일) | Mount Sharp Inside Gale Crater — 궤도 자료로 만든 입체 렌더링 | [NASA PIA15292](https://images.nasa.gov/details/PIA15292) | NASA/JPL-Caltech/ASU/UA |
| `syrtis.webp` | 맨눈으로 보기 (시르티스) | Mars at Ls 357°: Syrtis Major | [NASA PIA03675](https://images.nasa.gov/details/PIA03675) | NASA/JPL/MSSS |
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
| `sun/moons.svg` | 태양 달들 | Eight planets on one line at true relative distance, with the inner four — which pile up in eleven pixels — spread out again on a second line below |
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
true to scale and which were enlarged to be visible — planet dots in
`sun/moons.svg`, for instance, are not.

Each is plain SVG with no external fonts or images, between 0.8 KB and 2.6 KB.
Every aspect ratio is inside the 1:1–2:1 the panel takes.

**All eleven were redrawn on 2026-09-17** in the 340-unit coordinate space
described under the second Venus and Mercury pass below. They had been laid out
on a 660-unit canvas, which the panel shows at 0.41× — their lettering arrived
on screen at six pixels. Nothing about what they say changed; the canvas did,
and with it how much each one is allowed to say. Two needed more than a
re-scale: `sun/moons.svg` gave up its inset box, which could not survive the
smaller canvas, for two stacked distance lines; and `sun/numbers.svg` had its
caption lines pushed clear of the Sun's disc, which they had been sitting on.
Both of their `alt` texts and captions were rewritten to match, because a
description that no longer matches the picture is worse than none.

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

**Mercury stood at 8 of 20 and Venus at 4 of 20** after that pass. The section
below closes both.

### Venus and Mercury, second pass — added 2026-09-16 — `public/figures/`

The 16 Venus entries and 12 Mercury entries still empty were filled in one go.
Each was judged separately: a mechanism, a comparison, a distance or a cycle got
a drawing; a real object, an event, a spacecraft or a person got a photograph.
Nineteen came out as drawings and nine as photographs.

#### Drawn for this book

Same terms as the diagram section above — **drawn for this book, data from the
NASA planetary fact sheets** — and every caption opens with `이 책이 그린
도해입니다`.

| File | Entry | What it shows |
|---|---|---|
| `venus/weather.svg` | 금성 날씨 | Atmosphere in cross-section at true vertical scale — sulphuric-acid cloud deck 50–70 km, rain evaporating at 30 km, ground at 464 °C |
| `venus/atmosphere.svg` | 금성 대기와 하늘 | Greenhouse effect — sunlight in through the CO₂ blanket, heat turned back |
| `venus/magnetism.svg` | 금성 자기장 | Earth's own dipole standing the solar wind off, against Venus's induced field parting it at the cloud tops |
| `venus/scale.svg` | 금성 거리와 크기 | Distance bars at true ratio — 41 M km at closest, 260 M km at furthest, the Moon too near to draw |
| `venus/moons.svg` | 금성 위성 | Moon counts at true ratio — 0, 0, 1, 2, 115, 293 |
| `venus/origin.svg` | 금성 기원 | Deuterium enrichment — light hydrogen escaping, heavy hydrogen left behind, ~100× Earth |
| `venus/research.svg` | 금성 지금 연구 중 | Earth's carbon cycle closing, Venus's path back blocked for want of moving plates |
| `venus/history.svg` | 금성 발견의 역사 | The phases Galileo saw in 1610, thin crescents drawn large because they are nearer |
| `venus/etymology.svg` | 금성 이름의 유래 | The five agents of 오행 matched to the five naked-eye planets; 金 is metal, white, and west |
| `venus/culture.svg` | 금성 말 속의 흔적 | Friday's name splitting — dies Veneris → vendredi / venerdì / viernes, Frigg → Friday, 쇠 → 금요일 |
| `venus/livehere.svg` | 금성 사람이 산다면 | Breathable air floating as a balloon in CO₂ at 50 km, with pressure, temperature and gravity beside it |
| `mercury/weather.svg` | 수성 날씨 | Temperature bars at true ratio — 430 °C, −180 °C, and the polar crater floor steady at −170 °C |
| `mercury/magnetism.svg` | 수성 자기장 | Dipole centre offset north by one fifth of the radius, drawn at true offset |
| `mercury/scale.svg` | 수성 거리와 크기 | Grapefruit model at true distance ratio — 11 cm Sun, 0.38 mm Mercury at 4.5 m, 1 mm Earth at 12 m |
| `mercury/moons.svg` | 수성 위성 | Hill spheres at true ratio — 180 k, 1.00 M, 1.47 M, 0.98 M km |
| `mercury/origin.svg` | 수성 기원 | Core fraction at true ratio, both planets drawn one size — 85 % against 55 % |
| `mercury/future.svg` | 수성 앞으로의 계획 | BepiColombo's two orbiters at true orbit size and eccentricity — 480–1,500 km and 590–11,640 km |
| `mercury/livehere.svg` | 수성 사람이 산다면 | Polar terrain in cross-section — a ridge almost always lit beside a crater floor never lit |
| `mercury/myths.svg` | 수성 오해와 진실 | Mean surface temperature at true ratio in distance order — the nearest planet is not the hottest |
| `mercury/etymology.svg` | 수성 이름의 유래 | The seven classical metals matched to the seven bodies; Mercury takes quicksilver |

Each is plain SVG with no external fonts or images, between 1.2 KB and 3.3 KB,
every aspect ratio inside 1:1–2:1.

**They are drawn in a 340-unit coordinate space, not 660.** `.deep-dive-figure
img` gives the figure a box 260 pixels tall and at most 420 wide, and in the
side panel at a normal desktop width that box is about 272 pixels across. A
drawing laid out on a 660-unit canvas is shown there at 0.41×, which turns
15-unit lettering into 6-pixel lettering — present, but not readable, which is
exactly the complaint that sent this batch back. Setting `viewBox="0 0 340 H"`
while leaving `width="660"` keeps the published size inside the 660-pixel rule
and brings the on-screen scale to 0.8, so a 13-unit label lands at about 10
pixels beside a 12-pixel caption. The smaller canvas also caps how much a
figure can say, which is the useful half of the constraint: one idea, a title,
and three or four labels.

#### Photographs

| File | Entry | Title / subject | Source | Credit, exactly as printed |
|---|---|---|---|---|
| `venus/visit.webp` | 가 본 것들 | Checking Out Venus — JPL engineers reading Mariner 2's Venus flyby data, 14 Dec 1962 | [NASA PIA21117](https://images.nasa.gov/details/PIA21117) | NASA/JPL-Caltech |
| `venus/see.webp` | 찾아보기 | STS-30 sunset with Venus near the centre of the frame, May 1989 | [NASA s30-77-059](https://images.nasa.gov/details/s30-77-059) | NASA |
| `venus/future.webp` | 앞으로의 계획 | Helicopter carrying the VADIX prototype over Crater Island, Utah, 25 Jun 2026 | [NASA GSFC_20260625_DV_001485](https://images.nasa.gov/details/GSFC_20260625_DV_001485) | NASA/Mike Guinto |
| `venus/myths.webp` | 오해와 진실 | Venera 13 colour surface panorama, 1 Mar 1982 | [NASA NSSDCA Venus photo gallery](https://nssdc.gsfc.nasa.gov/photo_gallery/photogallery-venus.html) | Soviet Venera 13, provided to NSSDCA by what is now the Russian Space Agency |
| `venus/art.webp` | 이야기 속에서 | Venera 9 and 10 surface panoramas, 22 and 25 Oct 1975 | [NASA NSSDCA Venus photo gallery](https://nssdc.gsfc.nasa.gov/photo_gallery/photogallery-venus.html) | Soviet Venera 9 and 10, provided to NSSDCA by what is now the Russian Space Agency |
| `mercury/atmosphere.webp` | 대기와 하늘 | Exploring Mercury's Tail — UVVS scan of the sodium exosphere | [NASA PIA11076](https://images.nasa.gov/details/PIA11076) | NASA/Johns Hopkins University Applied Physics Laboratory/Arizona State University/Carnegie Institution of Washington. Figure 1 from McClintock et al., *Science*, **321**, 92–94, 2008 |
| `mercury/culture.webp` | 말 속의 흔적 | The Mercury Seven in pressure suits, July 1960 | [NASA s62-08774](https://images.nasa.gov/details/s62-08774) | NASA |
| `mercury/art.webp` | 이야기 속에서 | Enhanced Color Mercury Map | [NASA GSFC_20171208_Archive_e001425](https://images.nasa.gov/details/GSFC_20171208_Archive_e001425) | NASA/Johns Hopkins University Applied Physics Laboratory/Carnegie Institution of Washington |

**A rights note on the two Venera frames.** The NSSDCA gallery page that carries
them says, above the surface views: *"The following images were provided to
NSSDCA by what is now the Russian Space Agency and are not necessarily in the
public domain."* The credit is unambiguous and the images are published by NASA,
but that sentence is a caveat this file should not bury. It is recorded here
verbatim so the decision can be revisited.

**Four were cropped.** `venus/see.webp` came from a 4,158 × 4,158 frame that is
mostly black sky; a 2,000 × 1,000 window was taken from (1,100, 1,750) so Venus
and the twilight band fill it. `venus/myths.webp` came from a 928 × 385
panorama, 2.41:1 — a centred 770 × 385 keeps it inside 2:1. `venus/art.webp`
came from a 980 × 486 pair at 2.02:1, cropped to 970 × 486. `mercury/culture.webp`
came from a 4,096 × 5,120 portrait; 4,096 × 3,760 was taken from 700 pixels down.

**Three say in their captions that the colour is not what an eye would see.**
`mercury/atmosphere.webp` is a measurement with colours and English axis labels
assigned by the science team. `mercury/art.webp` reaches past visible light and
its colours were chosen to separate rock types. `venus/art.webp` carries Russian
lettering giving the probe name and date, and its caption says so.

**Venus and Mercury now stand at 20 of 20 each.** One entry was refused and
re-planned rather than filled with a borrowed picture: Venus 사람이 산다면 was
going to carry NASA Langley's HAVOC airship concept, but that page now returns
410 Gone and no copy with a checkable credit was found, so the entry carries a
drawing of the buoyancy principle instead — which is what the rule for this book
would have asked for anyway.

### Uranus — added 2026-09-17 — `public/figures/uranus/`

Twenty of twenty, in one pass: thirteen drawings and seven photographs. Uranus
is the body where the split is easiest to see. It has been visited once, for a
few days, forty years ago, so almost everything an entry wants to say is a
relation — a tilt, a distance, a span of years — and only a handful of things
are sights anyone has ever had.

#### Drawn for this book

Same terms as the diagram section above — **drawn for this book, data from the
NASA planetary fact sheets** — 340-unit canvas, and every caption opens with
`이 책이 그린 도해입니다`.

| File | Entry | What it shows |
|---|---|---|
| `structure.svg` | 구조 | Three layers in section — hydrogen and helium above, hot water/ammonia/methane below, an Earth-sized rock core; thicknesses approximate and the caption says so |
| `numbers.svg` | 숫자로 보면 | Uranus and Earth at true relative size — 50,724 km against 12,742 |
| `magnetism.svg` | 보이지 않는 껍질 | Spin axis against magnetic axis at the true 59°, with the field's centre offset a third of a radius |
| `mechanism.svg` | 작동 원리 | The 97.8° tilt at four points of the orbit, the axis pointing the same way at all four — which is what makes the seasons |
| `scale.svg` | 거리와 크기 | Sunlight's travel time at true relative distance — 8 min 20 s, 79 min, 2 h 40 min |
| `origin.svg` | 태어난 이야기 | Grown where the disc was thick, pushed out to where it is thin; captioned as a hypothesis |
| `orbit.svg` | 궤도와 이웃 | 84 years a lap, and the bar showing that 1781 to now is not yet three laps |
| `see.svg` | 찾아보기 | Magnitudes against the naked-eye limit — Sirius −1.5, Saturn 0.5, Uranus 5.7, limit 6.0 |
| `future.svg` | 앞으로의 계획 | The Jupiter gravity assist a Uranus orbiter would need; captioned as a route sketch, not a trajectory, and as not yet approved |
| `livehere.svg` | 사람이 산다면 | Earth's pole at six months of day and night against Uranus's forty-two years of each |
| `etymology.svg` | 이름의 유래 | 1781 discovery, 조지의 별, Bode's Uranus in 1782, Britain giving way in 1850 |
| `culture.svg` | 말 속의 흔적 | The solar system ending at Saturn, then reaching Uranus — the same line drawn twice at true relative distance, the second one twice as long |
| `myths.svg` | 오해와 진실 | A rolling ball's axis turning with it against Uranus's axis holding one direction |

Each is plain SVG with no external fonts or images, between 1.0 KB and 2.5 KB.

#### Photographs

| File | Entry | Title / subject | Source | Credit, exactly as printed |
|---|---|---|---|---|
| `weather.webp` | 날씨 | Uranus as seen by NASA Voyager 2 (1986) | [NASA PIA18182](https://images.nasa.gov/details/PIA18182) | NASA/JPL-Caltech |
| `atmosphere.webp` | 대기와 하늘 | Hubble WFC3 Uranus, November 2018 — the bright polar cloud cap | [NASA stsci-h-p1906c](https://images.nasa.gov/details/stsci-h-p1906c-f-514x514.a) | NASA, ESA, A. Simon (NASA Goddard Space Flight Center), and M.H. Wong and A. Hsu (University of California, Berkeley) |
| `moons.webp` | 위성 | South Polar View of Miranda — Voyager 2 mosaic, 24 Jan 1986 | [NASA PIA01490](https://images.nasa.gov/details/PIA01490) | NASA/JPL/USGS |
| `visit.webp` | 가 본 것들 | Uranus — Final Image, 25 Jan 1986, as Voyager 2 left | [NASA PIA00143](https://images.nasa.gov/details/PIA00143) | NASA/JPL |
| `research.webp` | 지금 연구 중 | Webb NIRCam Uranus with rings and polar cap, 2023 | [NASA Webb release](https://science.nasa.gov/missions/webb/nasas-webb-scores-another-ringed-world-with-new-image-of-uranus/) | NASA, ESA, CSA, STScI; Image Processing: Joseph DePasquale (STScI) |
| `history.webp` | 발견의 역사 | Astronomy: a 40-foot telescope constructed by William Herschel, in use outdoors. Coloured etching, 18‑‑. | [Wellcome Collection V0024766](https://wellcomecollection.org/works/srz5zy9y) | Wellcome Collection — **Public Domain Mark** |
| `art.webp` | 이야기 속에서 | Uranus Cyclone With Color Added — VLA microwave data, two of three colour maps | [NASA PIA25951](https://images.nasa.gov/details/PIA25951) | NASA/JPL-Caltech/VLA |

**The Wellcome etching is the first non-NASA, non-ESA picture in this project.**
Wellcome Collection is a museum and library, it states the licence on the record
itself, and Public Domain Mark carries no conditions at all — no attribution
required, no non-commercial clause, no share-alike. The credit line is here
anyway, on the same principle as everywhere else. It replaced the obvious
alternative, the Science Museum Group's Herschel material, whose images are
CC BY-NC-SA: the non-commercial and share-alike terms are conditions this book
cannot promise to keep, so that route was dropped rather than fudged.

**A word on that etching's date.** It shows the 40-foot telescope Herschel built
*after* the discovery, with the pension the king gave him. Uranus was found in
1781 with a much smaller instrument he made himself. The caption says so in as
many words, because a picture of the wrong telescope beside a discovery story is
exactly the kind of quiet error this file exists to prevent.

**Three were cropped.** `visit.webp` came from a 794 × 960 portrait; a 794 × 794
square was taken from 88 pixels down. `art.webp` came from a 1,166 × 458 strip of
three colour maps, 2.55:1 — a 744 × 458 window from x = 26 keeps the first two
whole and lands inside 2:1, and the caption says two of three. `atmosphere.webp`
is served at its published 514 × 514 rather than enlarged to 660.

**Four say in their captions that the colour is not what an eye would see.**
`research.webp` is infrared. `art.webp` is radio, twice, in two arbitrary colour
maps — which is the entry's point. `weather.webp` and `visit.webp` are Voyager
composites assembled from single-filter frames, and the 2024 re-analysis the
entry describes found that such composites were pushed harder than the data
warranted; the captions keep to what the frames show rather than asserting a
colour.

**One sentence was added to a body.** `art` discussed false colour only in
infrared, and its picture is radio. A sentence now says that radio is invisible
too and that researchers publish the same data in several colour maps side by
side. The picture illustrates a claim the text makes, rather than arriving with
a claim of its own.

**Nothing was left empty.** The one candidate that was refused outright is the
Fuseli *Titania and Bottom* held by Tate: its CC BY-NC-ND licence forbids both
commercial use and derivative works, and converting and resizing it would be a
derivative. `art` took the VLA colour maps instead, which serve that entry's
closing question — 이 색은 누가 정했을까 — better than a painting would.

### Neptune — added 2026-09-17 — `public/figures/neptune/`

Twenty of twenty: fourteen drawings and six photographs. Neptune has been seen
close up for a few days in 1989 and never since, so the balance tips further
towards drawings than it did for Uranus. Every photograph here except one comes
from that single week.

#### Drawn for this book

Same terms as the diagram section above — **drawn for this book, data from the
NASA planetary fact sheets** — 340-unit canvas, every caption opening with
`이 책이 그린 도해입니다`.

| File | Entry | What it shows |
|---|---|---|
| `numbers.svg` | 숫자로 보면 | Neptune and Earth at true relative size, with the 1.14 g noted — the closest surface gravity to Earth's among the four giants |
| `atmosphere.svg` | 대기와 하늘 | Why Neptune is bluer: the same methane under a thick haze on Uranus and a thin one on Neptune |
| `magnetism.svg` | 보이지 않는 껍질 | The two ice giants side by side at their true tilts, 59° and 47°, drawn in the same form as `uranus/magnetism.svg` so the pair reads as a pair |
| `mechanism.svg` | 작동 원리 | Bars at true ratio — equator 18 h, body 16 h, poles 12 h; the largest differential rotation in the solar system |
| `scale.svg` | 거리와 크기 | Light time at true relative distance out to 4 h 10 min, and what an eight-hour round trip does to a conversation |
| `origin.svg` | 태어난 이야기 | Neptune migrating outward and ploughing the ice ahead of it into the Kuiper belt; captioned as the Nice model, a hypothesis |
| `orbit.svg` | 궤도와 이웃 | 165 years a lap — 1846 to 2011 is one, and we are early in the second |
| `see.svg` | 찾아보기 | Magnitudes against the naked-eye limit, with Neptune at 7.8 falling outside it — the companion to `uranus/see.svg`, where Uranus falls just inside |
| `future.svg` | 앞으로의 계획 | The Jupiter assist and the twelve-year crossing; captioned as a route sketch and as undecided |
| `livehere.svg` | 사람이 산다면 | Four hours out, four hours back |
| `history.svg` | 발견의 역사 | The predicted position and the found one, less than a degree apart |
| `etymology.svg` | 이름의 유래 | Neptune and its moons as one sea-myth household |
| `culture.svg` | 말 속의 흔적 | Adams's track ending in a dead end, Le Verrier's reaching Galle — and the question of which one is the discovery |
| `myths.svg` | 오해와 진실 | The 1989 cobalt beside the 2024 re-derived pale cyan |

Each is plain SVG with no external fonts or images, between 0.9 KB and 2.2 KB.

#### Photographs

| File | Entry | Title / subject | Source | Credit, exactly as printed |
|---|---|---|---|---|
| `structure.webp` | 구조 | Neptune Rings — material clumped into arcs in the outer ring | [NASA PIA01493](https://images.nasa.gov/details/PIA01493) | NASA/JPL |
| `weather.webp` | 날씨 | Neptune — Great Dark Spot, Scooter, Dark Spot 2 | [NASA PIA00049](https://images.nasa.gov/details/PIA00049) | NASA/JPL |
| `moons.webp` | 위성 | Global Color Mosaic of Triton, 1989 | [NASA PIA00317](https://images.nasa.gov/details/PIA00317) | NASA/JPL/USGS |
| `visit.webp` | 가 본 것들 | Crescents of Neptune and Triton, as Voyager 2 departed | [NASA PIA02215](https://images.nasa.gov/details/PIA02215) | NASA/JPL |
| `research.webp` | 지금 연구 중 | Neptune (NIRCam Image), Webb, 2022 | [ESA/Webb weic2214c](https://esawebb.org/images/weic2214c/) | NASA, ESA, CSA, and STScI — **CC BY 4.0** |
| `art.webp` | 이야기 속에서 | Neptune, from the last whole-planet images through the green and orange filters | [NASA PIA01492](https://images.nasa.gov/details/PIA01492) | NASA/JPL |

**The Webb image is the project's first from esawebb.org.** ESA/Webb publishes
under **Creative Commons Attribution 4.0** — attribution only, no non-commercial
clause and no share-alike, so it passes the same test the Wellcome Public Domain
Mark did and the Science Museum Group's CC BY-NC-SA did not. The credit line is
carried in the caption, which is what the licence asks for.

**Two were cropped.** `weather.webp` came from a 1,000 × 1,000 reconstruction of
two frames whose edges carry raw green and blue registration bands; a 930 × 850
window from (4, 48) removes them without touching the planet. Nothing else was
cropped.

**Four captions say the colour was chosen, not seen.** `art.webp` is the famous
cobalt Neptune, and its caption says in as many words that the colour was pushed
so the cloud bands would show and that the real planet is paler — the entry it
sits in is about exactly that, so the picture and the text agree rather than
fight. `weather.webp` is from the same enhanced set. `moons.webp` had its colour
synthesised from separate high-resolution monochrome and lower-resolution colour
frames. `research.webp` is infrared, so its colour is an assignment.

**No entry was left empty, but one candidate was dropped.** `culture` — the
Adams-versus-Le Verrier priority quarrel — would have taken portraits of the two
men. Wellcome Collection has no portrait of either, and the Bibliothèque
nationale's Gallica returns 403 to a plain request, so no scan with a checkable
licence was found in two tries. The entry took a diagram of the two tracks
instead, which carries the entry's actual question — what counts as a discovery —
better than two faces would.

**Two figures are deliberately built to match Uranus's.** `magnetism.svg` uses
the same disc, dashed spin axis and solid magnetic axis as `uranus/magnetism.svg`,
and `see.svg` uses the same magnitude scale as `uranus/see.svg`. The Neptune
magnetism entry's whole argument is that one odd planet is an anomaly and two are
a rule; the figures should let a reader see that the way the text says it.

### Jupiter, the fourteen remaining entries

Jupiter already carried six figures. This pass filled the other fourteen, so all
twenty entries now have one. Three took photographs and eleven took diagrams.

| Entry | File | Source and credit |
| --- | --- | --- |
| `magnetism` | `magnetism.webp` | Hubble Space Telescope. Credit as published: *NASA, ESA, and J. Nichols (University of Leicester)*. Public domain / NASA media usage. |
| `orbit` | `orbit.webp` | JPL Photojournal PIA01265, "Month-long Evolution of the D/G Jupiter Impact Sites from Comet P/Shoemaker-Levy 9", Hubble Space Telescope, Wide Field Planetary Camera 2. Credit as published: *JPL/NASA/STScI*. |
| `future` | `future.webp` | Europa Clipper assembly in the clean room, from JPL Photojournal PIA25125. Credit as published: *NASA/JPL-Caltech/Johns Hopkins APL*. |

All three were converted to webp at quality 82 and resized to 660px wide.
`future.webp` was cropped before resizing — the original is a montage of four
panels, and `extract 10 732 1068 668` takes the single assembly panel out of it.
Nothing else was cropped.

**The impact photograph keeps its English labels.** `orbit.webp` is a four-panel
montage with the dates printed on it in English, and it was kept that way rather
than cropped down to one panel, because the whole point of the entry's sentence
is that the scar changed over a month. The caption says in as many words that the
lettering is English and gives the four dates in Korean.

**Eleven diagrams, drawn for this book.** `structure`, `numbers`, `atmosphere`,
`scale`, `origin`, `see`, `livehere`, `history`, `etymology`, `culture`, `art`.
All follow the 340-unit convention: `viewBox="0 0 340 H"` with `width="660"`, one
title, three or four labels, Korean throughout. Numbers come from the NASA
planetary fact sheets and from the entries they sit in.

Four of them are drawn to real proportion and say so in the caption.
`structure.svg` puts the metallic-hydrogen and dilute-core boundaries at the
radii the entry quotes. `numbers.svg` draws Earth and Jupiter at the true 1:11
diameter ratio. `scale.svg` spaces Sun, Earth and Jupiter at 1:5.2. `origin.svg`
lays 1, 13 and 80 Jupiter masses on a linear axis, which is the whole argument —
13 sits almost on top of 1, and 80 is far away. `art.svg` spaces 1610, 1880 and
1979 linearly on a line ending at 2026. The rest say in their captions that a
thickness or a size was enlarged to be visible.

**Two diagrams carry an explicit disclaimer in the caption.** `history.svg` is
not a copy of Galileo's notebook; it only shows that the number and position of
the dots changed from night to night, and the caption says so. `etymology.svg`
draws twelve equal divisions to show the one-year-per-division idea, and the
caption says the boundaries are not real constellation boundaries.

**No Jupiter entry was left empty.** Two candidates were dropped along the way
and replaced by diagrams. A JunoCam view for `atmosphere` was refused because the
striking versions are citizen-scientist processings whose credit line names a
private individual, which this book does not accept. A Holst manuscript or
concert programme for `art` was not found in a collection whose licence could be
read in two tries, so `art` took the timeline instead — which also lets the entry
say the thing it is actually about, that the way people recorded Jupiter changed
from hand to machine.

### The second layer — everything outside the solar system

Added in one pass. The second layer's fourteen topics hold forty-five deep-dive
entries between them; eight already carried a picture (the Star life set above)
and the other **thirty-seven** were filled here — eighteen photographs and
nineteen diagrams. Every entry on the second layer now has a figure.

The media field is the same `DeepDiveMedia` as the first layer, and the paths
follow the same rule: `public/figures/<cosmosId>/<category>.<ext>`. Two of the
four data files build their entries through a helper (`entry(...)` in
`galaxy-reading.ts`, `chapter(...)` in `atlas-topics.ts`); both helpers took an
optional fifth `media` argument so that every existing call is unchanged.

#### Photographs

| Entry | File | Source | Credit, exactly as printed |
|---|---|---|---|
| `star-life/imagine` | `imagine.webp` | [ESO eso1629a](https://www.eso.org/public/images/eso1629a/) | Credit: ESO/M. Kornmesser |
| `big-bang/light` | `light.webp` | [JPL Photojournal PIA16873](https://photojournal.jpl.nasa.gov/catalog/PIA16873) | Credits: ESA and the Planck Collaboration |
| `big-bang/birth` | `birth.webp` | [ESA/Webb weic2317a](https://esawebb.org/images/weic2317a-h1dd3n/) | Credit: ESA/Webb, NASA, ESA, CSA, B. Robertson (UC Santa Cruz), B. Johnson (Center for Astrophysics, Harvard & Smithsonian), S. Tacchella (University of Cambridge), M. Rieke (Univ. of Arizona), D. Eisenstein (Center for Astrophysics, Harvard & Smithsonian), A. Pagan (STScI) |
| `milky-way/inside` | `inside.webp` | [ESA, Gaia's sky in colour](https://www.esa.int/ESA_Multimedia/Images/2018/04/Gaia_s_sky_in_colour) | ESA/Gaia/DPAC; Map: CC BY-SA 3.0 IGO |
| `andromeda/observe` | `observe.webp` | [JPL Photojournal PIA15416](https://photojournal.jpl.nasa.gov/catalog/PIA15416) | Credits: NASA/JPL-Caltech |
| `large-magellanic-cloud/whatis` | `whatis.webp` | [ESO eso1914a](https://www.eso.org/public/images/eso1914a/) | Credit: ESO/VMC Survey |
| `large-magellanic-cloud/birth` | `birth.webp` | [ESA/Webb weic2212a](https://esawebb.org/images/weic2212a/) | Credit: NASA, ESA, CSA, and STScI |
| `m87/inside` | `inside.webp` | [ESA/Hubble heic2411b](https://esahubble.org/images/heic2411b/) | Credit: NASA, ESA, A. Lessing (Stanford University), E. Baltz (Stanford University), M. Shara (AMNH), J. DePasquale (STScI) |
| `m87/discover` | `discover.webp` | [ESO eso1907a](https://www.eso.org/public/images/eso1907a/) | Credit: EHT Collaboration |
| `black-holes/discover` | `discover.webp` | [Chandra, Cygnus X-1, 17 Nov 2011](https://chandra.harvard.edu/photo/2011/cygx1/) | Credit  Optical: DSS; Illustration: NASA/CXC/M.Weiss |
| `nebulae/birth` | `birth.webp` | [ESA/Webb weic2216b](https://esawebb.org/images/weic2216b/) | Credit: NASA, ESA, CSA, STScI; J. DePasquale, A. Koekemoer, A. Pagan (STScI). |
| `nebulae/change` | `change.webp` | [ESA/Hubble heic0307a](https://esahubble.org/images/heic0307a/) | Credit: NASA, NOAO, ESA, the Hubble Helix Nebula Team, M. Meixner (STScI), and T.A. Rector (NRAO) |
| `exoplanets/unknown` | `unknown.webp` | [JPL Photojournal PIA21751](https://photojournal.jpl.nasa.gov/catalog/PIA21751) | Credits: NASA/JPL-Caltech |
| `moon/light` | `light.webp` | [NASA image library `GSFC_20171208_Archive_e001939`](https://images.nasa.gov/details/GSFC_20171208_Archive_e001939) | Credit: NASA/Goddard/Arizona State University |
| `moon/birth` | `birth.webp` | [NASA image library `S69-60354`](https://images.nasa.gov/details/S69-60354) | NASA (no photographer named) |
| `small-worlds/discover` | `discover.webp` | [NASA image library `jsc2024e023024`](https://images.nasa.gov/details/jsc2024e023024) | NASA / Erika Blumenfeld & Joseph Aebers |
| `dark-universe/discover` | `discover.webp` | [Chandra, 1E 0657-56, 21 Aug 2006](https://chandra.harvard.edu/photo/2006/1e0657/) | Credit  X-ray: NASA/CXC/CfA/M.Markevitch et al.; Optical: NASA/STScI; Magellan/U.Arizona/D.Clowe et al.; Lensing Map: NASA/STScI; ESO WFI; Magellan/U.Arizona/D.Clowe et al. |
| `telescopes/observe` | `observe.webp` | [ESA/Hubble heic0406a](https://esahubble.org/images/heic0406a/) | Credit: NASA, ESA, and S. Beckwith (STScI) and the HUDF Team |

All eighteen were converted to WebP at quality 82 and resized so the width is at
most 660 pixels. Five were cropped first, and each crop is recorded here:

- `nebulae/birth.webp` — the Webb Pillars are published 8,423 × 14,589, a ratio
  of 1 : 1.73 the wrong way round for the panel. A centred square was taken
  (`extract 3901 0 8423 8423`) so that the pillars still run corner to corner.
- `large-magellanic-cloud/whatis.webp` — 1,280 × 1,430 trimmed to a square
  (`extract 75 0 1280 1280`).
- `m87/discover.webp` — the EHT ring sits in a wide black frame; a centred
  square (`extract 0 267 746 746`) brings the ring up to panel size.
- `andromeda/observe.webp` — the GALEX mosaic has black wedges at two corners;
  `extract 400 1000 7900 5800` removes them.
- `big-bang/birth.webp` — the JADES release is a pull-out collage, a small
  context frame beside a large detail panel. `extract 44 546 690 492` takes the
  detail panel alone, without its white border or the leader lines.
- `moon/birth.webp` — `extract 168 137 1400 1050` crops in on the rock, which is
  otherwise a small object in a dim laboratory scene.

**Licences, and one refusal worth recording.** ESO and ESA/Hubble and ESA/Webb
publish under **CC BY 4.0**, and those four sites state that carrying the full
credit line visibly is mandatory — so for every one of them the credit is in the
on-screen caption, not only here. NASA material is public domain. The Gaia sky
map is the one item under **CC BY-SA 3.0 IGO**, which its ESA page offers
alongside the ESA Standard Licence; the share-alike option was taken, because
the Standard Licence carries a clause forbidding commercial use and this book
does not accept non-commercial-only terms.

That same clause is why the Planck map did **not** come from `esa.int`. ESA's
own page for *Planck's view of the cosmic microwave background* offers it under
the ESA Standard Licence alone, with no Creative Commons option. The identical
map is published by NASA's Photojournal as PIA16873, credited to "ESA and the
Planck Collaboration" and distributed on NASA's media-usage terms, which carry
no such restriction. The NASA-distributed copy is the one used, and the ESA
credit line is reproduced in full both here and in the caption.

**Nine captions say the colour or the picture was made, not seen.** Six are
assigned colour: `big-bang/light` (temperature differences of one part in a
hundred thousand), `big-bang/birth`, `large-magellanic-cloud/whatis`,
`large-magellanic-cloud/birth` and `nebulae/birth` (all infrared),
`andromeda/observe` (ultraviolet), `m87/discover` (radio brightness), and
`dark-universe/discover` (X-ray gas in pink, a lensing mass map in blue).
Three are not photographs at all but artists' impressions, and each caption says
so in as many words before describing anything: `star-life/imagine` (Proxima b),
`black-holes/discover` (Cygnus X-1) and `exoplanets/unknown` (TRAPPIST-1). The
TRAPPIST-1 caption goes further and says the surfaces are not known, because the
entry it sits in is about how little a habitable-zone distance actually tells
you, and a blue-and-white render could undo that on its own.

**No caption has to warn about English lettering**, because every photograph
chosen here is unlabelled. Where the best release existed only as an annotated
figure — the Andromeda mosaic and the JADES pull-out — the annotation was
cropped away or the release was passed over, rather than carried into a panel a
five-year-old is reading.

**One photograph disagrees with its own release page, and the caption avoids
it.** ESA/Hubble's 2003 page for the Helix Nebula gives a distance of 2,500
light years; the entry says about 650, which is the modern value from Gaia
parallaxes. The caption carries no distance at all rather than repeat the older
number beside text that contradicts it. The same care was taken with the M87
jet, where the release says 3,000 light years and the entry says about 5,000 —
the caption names the jet and gives no length.

#### Diagrams

Nineteen, drawn for this book, all on the 340-unit convention — `viewBox="0 0
340 H"` with `width="660"`, one title, three or four labels, Korean throughout.

Recorded here by **file path**. They were first written in a short-name
shorthand (`star-life` — `size`, `inside`, …) which reads well but which a
filename search does not find; the list was rewritten in full on 2026-09-17 so
that every figure in this document can be located by its path.

| File | Entry |
|---|---|
| `star-life/size.svg` | 별은 얼마나 클까 |
| `star-life/inside.svg` | 양파처럼 층이 진다 |
| `star-life/light.svg` | 색을 보면 온도를 안다 |
| `star-life/change.svg` | 무게가 운명을 가른다 |
| `star-life/discover.svg` | 별을 어떻게 알아냈나 |
| `star-life/scale.svg` | 빛으로 4년 |
| `big-bang/whatis.svg` | 어디에서 터진 걸까 |
| `milky-way/ushere.svg` | 태양계의 주소는 중심이 아니다 |
| `andromeda/change.svg` | 미래의 충돌은 정해져 있을까 |
| `black-holes/inside.svg` | 검은 부분과 빛나는 고리는 다르다 |
| `black-holes/unknown.svg` | 중심에서는 무엇이 일어날까 |
| `nebulae/light.svg` | 사진 속 분홍색은 진짜일까 |
| `exoplanets/discover.svg` | 별빛의 작은 홈 읽기 |
| `exoplanets/observe.svg` | 별도 조금씩 움직인다 |
| `small-worlds/whatis.svg` | 유성과 운석은 어떻게 다를까 |
| `light/light.svg` | 눈에 보이지 않는 빛 |
| `light/change.svg` | 빛의 물결도 길어진다 |
| `dark-universe/unknown.svg` | 팽창은 왜 빨라질까 |
| `telescopes/ushere.svg` | 오늘 밤부터 관측자가 되는 법 |

Seven are drawn to real proportion and say so in the caption:

- `star-life/size` — UY Scuti's disc against the orbits of Mars and Jupiter. At
  900 solar radii the star's radius is 4.18 au, which falls between Mars at 1.52
  and Jupiter at 5.2, and the drawing puts it exactly there. The Sun is a
  one-unit dot because at that scale it is smaller than a printed full stop, and
  the caption says so.
- `milky-way/ushere` — the Sun at 26,000 of the disc's 50,000 light-year radius.
- `black-holes/inside` — shadow and horizon at a diameter ratio of 2.5, the
  figure the entry quotes.
- `exoplanets/discover` — star, Jupiter and Earth at true diameter ratios of
  1 : 1/10 : 1/109. Earth comes out at half a unit and is genuinely invisible,
  which is the entry's point; a dashed ring marks where it would be and the
  caption explains that the ring is a pointer, not the planet.
- `big-bang/whatis` — the raisins in the risen loaf are moved out by exactly the
  ratio the dough expands (1.84×), and the raisins themselves stay the same size.
- `star-life/scale` and `star-life/light` say the opposite in their captions:
  their circles are drawn to be told apart, not to scale.

Four diagrams carry an explicit disclaimer beyond the usual:

- `star-life/change` says the mass boundaries are a rough guide that does not
  divide every star exactly — the entry itself opens with that caveat, and a
  three-way diagram could easily suggest otherwise. For the same reason it does
  **not** draw the 8 and 25 solar-mass thresholds that were suggested as
  candidates: the entry names neither number, and states that a single birth
  mass cannot settle the outcome.
- `star-life/discover` says the timeline records order only, since a linear axis
  from Hipparchus to Gaia would crush everything into the last inch.
- `milky-way/ushere` says the spiral arms were left undrawn because their
  positions are still unsettled — which is exactly what the entry's closing
  sentence warns the reader about.
- `andromeda/change` says the half-and-half bar is an approximation of the 2025
  probability, not a measured value.

**No diagram repeats a ConceptScene.** The second layer already carries eight
interactive `ConceptScene` diagrams, one per atlas topic, and where a topic's
entries took a diagram it was checked against that scene first. The scene for
`black-holes` varies horizon radius with mass, so `black-holes/inside` draws the
shadow-to-horizon ratio instead — a distinction the scene explicitly says it
does not show. The `transit` scene draws a light curve, so `exoplanets/discover`
draws the occulted areas that set the curve's depth, and `exoplanets/observe`
draws the barycentre wobble the scene says it omits. The `spectrum` scene
stretches a wave with a slider, so `light/change` draws what that means at
arrival — ultraviolet leaving, infrared landing. The `moon` scene draws phases,
so `moon/light` took a photograph of the far side, the part of that entry the
scene leaves out. The `nebula`, `dark`, `orbits` and `telescope` scenes were
checked the same way.

**No entry was left empty, and three candidates were dropped.** A JunoCam-style
citizen-scientist processing was never in scope. The LIGO GW150914 waveform was
considered for `black-holes/discover` and rejected: it is a plot with English
axis labels, and at the 272-pixel width the panel actually draws, a plot is a
grey smudge. NASA's `PIA21424`, a habitable-zone diagram for TRAPPIST-1, was
rejected for `exoplanets/unknown` for the same reason — it is mostly English
type. Both entries took an image instead of a figure of text.

### Saturn's remaining twelve, and the last five of the first layer

The pass that finished the book. Saturn's twelve empty entries took five
photographs and seven diagrams; the last five gaps elsewhere on the first layer
— three in the Sun, one in Earth, one in Mars — all took diagrams. With these,
**every one of the 225 entries in both layers carries a figure**: 180 on the
first layer's nine bodies and 45 on the second layer's fourteen topics.

#### Photographs — five, all Saturn

| Entry | File | Source | Credit, exactly as printed |
|---|---|---|---|
| `atmosphere` | `atmosphere.webp` | [JPL Photojournal PIA06193](https://photojournal.jpl.nasa.gov/catalog/PIA06193) | Credits: NASA/JPL/Space Science Institute |
| `magnetism` | `magnetism.webp` | [ESA/Hubble heic1815a](https://esahubble.org/images/heic1815a/) | Credit: ESA/Hubble, NASA, A. Simon (GSFC) and the OPAL Team, J. DePasquale (STScI), L. Lamy (Observatoire de Paris) |
| `myths` | `myths.webp` | [JPL Photojournal PIA20506](https://photojournal.jpl.nasa.gov/catalog/PIA20506) | Credits: NASA/JPL-Caltech/Space Science Institute |
| `art` | `art.webp` | [JPL Photojournal PIA17172](https://photojournal.jpl.nasa.gov/catalog/PIA17172) | Credits: NASA/JPL-Caltech/SSI |
| `future` | `future.webp` | [Dragonfly gallery, JHU APL](https://dragonfly.jhuapl.edu/Gallery/) | NASA/Johns Hopkins APL/Steve Gribben |

All five were converted to WebP at quality 82 and resized to at most 660 pixels
wide. One was cropped: `art.webp` is published 9,000 × 3,500, a ratio of 2.57
that the panel cannot take, so `extract 0 1400 7000 3500` centres Saturn and
brings it to exactly 2:1. Nothing else was cropped.

`future.webp` is the only file in the book that did not come from NASA, ESA, ESO
or a named museum. The Johns Hopkins Applied Physics Laboratory builds and
operates Dragonfly for NASA and publishes the mission's renderings in its own
gallery with the credit line above. Steve Gribben is APL's staff illustrator and
the institutions stand in front of his name, which is the same test that let in
`NASA/CXC/M.Weiss` and `NASA/Johns Hopkins APL/Ed Whitman`.

**Three captions say the picture was made rather than seen.** `magnetism.webp`
is a composite: the aurora is ultraviolet, invisible to the eye, photographed
separately and laid over the visible-light disc. `future.webp` is an artist's
impression of a spacecraft that has not launched, and its caption says so before
it says anything else. `myths.webp` was taken with a monochrome camera and the
caption says the picture is black and white rather than letting a reader assume
the rings are colourless.

**`art.webp` carries a caption that admits what cannot be seen.** The entry is
about the day Cassini turned round and photographed Earth from behind Saturn,
and about the people who went outside to wave. Earth is three pixels in the
original and nothing at all at 272 pixels, so the caption says plainly that
Earth is in the frame and cannot be made out at this size. The same picture was
turned down for `saturn/scale` in an earlier pass for exactly that reason; here
the entry is about the event, not about seeing the dot, so it belongs.

**Two photograph candidates were dropped.**

- The Cassini hexagon was the obvious choice for `myths`, whose fourth
  paragraph is about the hexagon. It could not be used: `saturn/weather.webp` is
  already PIA21327, *Hail the Hexagon*, and the same picture must not appear
  twice. The entry's second paragraph — the belief that the rings are one solid
  sheet — took its place, with a close Cassini view of the thousands of separate
  ringlets. Hubble's 2026 release of a **decagon** at Saturn's south pole
  (`heic2612a`) was also examined, since a ten-sided polygon would have made the
  entry's point about polygon count better than anything; it was rejected
  because it is a two-panel collage labelled in English, and because using it
  would have required adding a fact the entry does not yet carry.
- Two historical works named in the entries — Huygens's 1659 *Systema
  Saturnium* ring figure for `history`, and Trouvelot's 1874 Saturn pastel for
  `art` — are long out of copyright, but a scan is only usable if the holding
  institution's terms can be read. Three were tried and none answered: the New
  York Public Library's search returned a 205-byte stub, the Library of
  Congress served a Cloudflare challenge instead of its JSON, and e-rara
  returned an empty body. `history` took a diagram instead.

#### Diagrams — twelve

Saturn: `numbers`, `origin`, `orbit`, `livehere`, `history`, `etymology`,
`culture`. Sun: `future`, `history`, `etymology`. Earth: `etymology`. Mars:
`etymology`. All on the 340-unit convention.

Five are drawn to real proportion and say so in the caption:

- `saturn/numbers` — Earth and Saturn at the true 9.5:1 diameter ratio, and
  Saturn drawn as the flattened ellipse it actually is rather than a circle.
- `saturn/origin` — the ring-age dispute on a linear axis from now to 4.5
  billion years. The young camp's 100–400 million years is a narrow band hard
  against the left end; the old camp sits at the far right. The gap between two
  readings of the same photographs is the whole point, and a linear axis is the
  only honest way to show it.
- `saturn/orbit` — Jupiter's and Saturn's orbits at their true 5.2:9.5 radius
  ratio.
- `saturn/livehere` — atmospheric pressure as bar height at true ratio. Earth's
  1 bar and Titan's 1.5 stand up; Mars's 0.006 works out at a quarter of one
  unit and is invisible, which is exactly why Titan needs no pressure suit and
  Mars does.
- `saturn/culture` — a human lifetime of eighty years with a tick every 29.5,
  giving two full Saturn orbits and part of a third. The third tick is labelled
  "세 바퀴째" rather than "세 바퀴", because eighty years does not contain three.

The other seven say in their captions that spacing or size was chosen for
legibility: the two-column timelines (`sun/history`, `saturn/history`), the name
genealogies (`sun/etymology`, `earth/etymology`, `mars/etymology`,
`saturn/etymology`) and `sun/future`.

**Three diagrams carry a disclaimer beyond the usual.** `saturn/history` says it
is not a copy of Galileo's notebook, only a picture of what appeared and what
vanished. `sun/future` says the orbit and the angle are positional, not to
scale, and marks in red the side of the Sun that Earth cannot yet see — the
reason a spacecraft off to the side gets a few days' warning. `earth/etymology`
says its three god-named planets are examples, not the full list.

**`sun/history` and `sun/etymology` were meant to be photographs and are not.**
The plan was a 앙부일구 from the National Palace Museum for `history` and a
sun-motif artefact for `etymology`, both through e뮤지엄. Two attempts failed for
a reason worth recording: e뮤지엄's search URL returns a 1.2 KB JavaScript shell
and the National Museum of Korea's relic search returns a page whose results are
filled in by script, so neither serves a credit line to a plain request. The
same search also had to find 곤여만국전도 for `earth/etymology` and did not.
There is a second reason `sun/history` is better off as a diagram: the Sun's
`culture` entry already carries a 휴대용 앙부일구 from the National Museum of
Korea, and a second sundial would have been the same subject twice.

### Gas-giant hotspots — added 2026-09-17 — `public/figures/jupiter/`, `public/figures/saturn/`

Splitting Jupiter's and Saturn's polar storms into entries of their own left
four entries needing a picture, and moved one picture from one entry to another.

| File | PIA | Title | Credit |
|---|---|---|---|
| `jupiter/north-pole.webp` | PIA22335 | Cyclones Encircle Jupiter's North Pole | NASA/JPL-Caltech/SwRI/ASI/INAF/JIRAM |
| `jupiter/south-pole.webp` | PIA23556 | Jupiter's South Pole Cyclones in 2016 | NASA/JPL-Caltech/SwRI/ASI/INAF/JIRAM |
| `saturn/hexagon.webp` | PIA21327 | Hail the Hexagon | NASA/JPL-Caltech/Space Science Institute |
| `saturn/white-spot.webp` | PIA12826 | Catching its Tail | NASA/JPL-Caltech/Space Science Institute |

**`saturn/weather.webp` changed picture.** It used to be PIA21327, *Hail the
Hexagon*. The hexagon now has an entry of its own, so that picture went with it
and is filed above as `saturn/hexagon.webp` — the same file, byte for byte, not
a second crop. The parent entry, which is about the muted belts and the fast
winds, took PIA21348, *Circles and Hexagons*: an oblique monochrome view of the
northern hemisphere in which the belts are visible as the faint bands the entry
describes. The table in the 2026-09-10 Saturn section has been corrected to
match; the old row would otherwise credit a picture the file no longer holds.

**Both Juno pictures are false colour, and both captions say so.** JIRAM is an
infrared instrument; what it records is heat, not light the eye could see, and
the colours are assigned afterwards to separate warm from cold. The Korean
captions state this in as many words — 「따뜻한 곳과 찬 곳을 색으로 나타낸 것이라,
눈으로 보면 이런 색이 아닙니다」 and 「색은 온도를 나타내려고 입힌 것이에요」 — because
a child reading the entry has no other way to know that the picture is not a
photograph in the ordinary sense.

**`saturn/white-spot.webp` is true colour**, and the NASA description says so
explicitly, so no such disclaimer was added. The storm in it had wrapped far
enough around the planet to overtake its own tail, which is what the entry's
caption describes.

**Oval BA and the Cassini Division were dropped**, so neither needed a picture.
The reasons are recorded in `src/data/hotspots.ts`: the texture shows no
localized feature at Oval BA's latitude, and the Cassini Division is a radius in
the rings rather than a point on the sphere the pins are attached to.

### The remaining five bodies' hotspots — added 2026-09-17

Mercury, Venus, Uranus and Neptune each had entries split out so that every pin
could open one of its own. Thirteen entries needed a figure: six photographs and
seven diagrams. The Sun got no pins at all, for reasons recorded in
`src/data/hotspots.ts` under `SUN_NO_SPOTS`, so it needed nothing.

#### Photographs

| File | Entry | Title / subject | Source | Credit, exactly as printed |
|---|---|---|---|---|
| `mercury/caloris.webp` | 행성에 남은 가장 큰 흉터 | The Great Caloris Basin on Mercury | [NASA PIA10383](https://images.nasa.gov/details/PIA10383) | NASA/Johns Hopkins University Applied Physics Laboratory/Carnegie Institution of Washington/Brown University |
| `venus/maxwell.webp` | 에베레스트보다 높은 산 | Venus — Maxwell Montes and Cleopatra Crater | [NASA PIA00149](https://images.nasa.gov/details/PIA00149) | NASA/JPL |
| `venus/ishtar.webp` | 북쪽의 대륙, 이슈타르 | Hemispheric View of Venus Centered at the North Pole | [NASA PIA00007](https://images.nasa.gov/details/PIA00007) | NASA/JPL/USGS |
| `venus/aphrodite.webp` | 적도를 두른 대륙 | Hemispheric View of Venus Centered at 90 Degrees East Longitude | [NASA PIA00158](https://images.nasa.gov/details/PIA00158) | NASA/JPL/USGS |
| `uranus/polar-cap.webp` | 극을 덮은 밝은 모자 | Uranus close-up view (NIRCam), December 2023 | [ESA/Webb weic2332a](https://esawebb.org/images/weic2332a/) | NASA, ESA, CSA, STScI |
| `neptune/dark-spot.webp` | 다섯 해 만에 사라진 점 | Neptune Great Dark Spot in High Resolution | [NASA PIA00052](https://images.nasa.gov/details/PIA00052) | NASA/JPL |

**Crops.** `neptune/dark-spot.webp` is the only one cropped. PIA00052 is 700 ×
852, taller than it is wide, and the house rule wants between 1:1 and 2:1
landscape. Taking `extract 60 0 700 530` — sixty pixels down from the top, the
full width, 530 rows — keeps the whole dark oval and the feathery clouds along
its lower edge and drops empty blue. Everything else was resized to 660 px wide
and converted at quality 82 with nothing removed.

**Three of these are false colour and all three captions say so.**
`venus/ishtar.webp` and `venus/aphrodite.webp` are Magellan radar mosaics
coloured by elevation, with an English scale bar reading "Planetary Radius (km)"
in the corner; both captions state that the colours were applied by people to
show height and that the scale is in English. `uranus/polar-cap.webp` is a
near-infrared image, so its caption says the colours are not what an eye would
see. `venus/maxwell.webp` is radar brightness rather than light, which the
caption explains as roughness — and the black diagonal stripes across it are
gaps between the strips Magellan mapped in, which the caption also explains
rather than hiding.

**A figure that corrects a famous picture.** The Maat Mons entry uses a diagram
rather than PIA00106 or PIA00254, the two well-known Magellan perspective views,
because both exaggerate the vertical scale ten times — NASA's own caption for
PIA00106 says so. `venus/structure.webp` already carries PIA00106 with that
warning in its caption. The new diagram draws the volcano twice at the same base
width, once exaggerated and once at its true 395 km by 5 km, so a reader can see
what the ten times actually does.

#### Diagrams drawn for this book

| File | Entry | What it shows |
|---|---|---|
| `mercury/caloris-antipode.svg` | 반대편이 들썩인 자리 | Mercury in section — shock paths through the interior and around the surface meeting at the exact antipode |
| `mercury/beethoven.svg` | 가장 큰 구덩이에 붙은 음악가 | Rembrandt 716, Beethoven 630, Dostoevskij 430 and Tolstoj 355 km drawn at true relative diameter, with the year each name was approved |
| `mercury/chong-chol.svg` | 관동별곡을 쓴 사람의 구덩이 | Mercury unrolled flat, with Chŏng Ch'ŏl at 46.87 N and Yun Son-do at 73.49 S marked |
| `mercury/yun-son-do.svg` | 어부사시사를 쓴 사람의 구덩이 | The 76 km crater and Seoul's 37 km east–west span overlaid at one scale |
| `venus/maat-mons.svg` | 아직 살아 있는 화산 | Maat Mons at ten times vertical exaggeration above, at its true 395 : 5 proportion below, both to the same base width |
| `neptune/scooter.svg` | 스쿠터라는 별명이 붙은 구름 | The Great Dark Spot at 20 S, the Scooter at 42 S and Dark Spot 2 at 55 S on the disc |
| `neptune/south-pole.svg` | 남극에 난 굴뚝 | Methane held under a cold layer, the layer broken only over the warmer south pole |

Every diameter, latitude and year in these seven comes from the IAU Gazetteer of
Planetary Nomenclature or from the entry's own verified text; none was invented
to make a drawing balance. All seven were rendered at 272 px, the width they
actually occupy in the panel, and read before being committed — two were redrawn
because labels overlapped the shapes at that size.

**Why so many diagrams.** Four of the seven are Mercury's, and that is not
laziness. NASA's library has no image of the hilly and lineated terrain at
Caloris's antipode, and the Beethoven, Chŏng Ch'ŏl and Yun Son-do craters are
subdued, lava-flooded basins that do not stand out in a global mosaic — the one
Mariner 10 quadrangle covering Beethoven is mostly bright ray craters and black
data gaps. A diagram that states a size or a position honestly serves a child
better than a photograph in which the named thing cannot be picked out.

**One picture was deliberately not reused.** PIA01142, *Neptune Scooter*, is a
real Voyager photograph showing the Scooter, and it was downloaded and examined.
It is the same Voyager view already used as `neptune/weather.webp`, differing
only in processing, so putting it in a second entry would have shown the reader
the same picture twice. The Scooter entry took a diagram instead.

### The Big Bang's five new entries — added 2026-09-17 — `public/figures/big-bang/`

The topic went from three deep-dive entries to eight, and the five new ones
needed a figure each. Recorded here by **file path**, not by the short-name
shorthand the earlier second-layer diagrams use — that shorthand is readable but
a filename search does not find it, so anything added from here on is written
out in full.

#### Photograph

| File | Entry | Title / subject | Source | Credit, exactly as printed |
|---|---|---|---|---|
| `big-bang/observe.webp` | 은하를 세어 그린 지도 | Extended Source/Galaxy All Sky 2 — 1.6 million galaxies from the Two Micron All-Sky Survey | [NASA PIA04251](https://images.nasa.gov/details/PIA04251) | Two Micron All-Sky Survey |

The full credit is lettered into the image itself — "Infrared Processing and
Analysis Center / California Institute of Technology & University of
Massachusetts" — and the Korean caption repeats it rather than cropping it out.
The caption also says that the colours stand for three infrared wavelengths
rather than anything an eye would see, that the blue band across the middle is
our own galaxy's stars, and that the lettering on the image is English. Resized
to 660 px and converted at quality 82; nothing cropped.

#### Diagrams drawn for this book

| File | Entry | What it shows |
|---|---|---|
| `big-bang/size.svg` | 눈 깜짝할 사이에 커진 우주 | Three bars whose lengths count *digits*, not sizes — 26 zeros for inflation, 3 for the 13.8 billion years since, 2 for a seed growing into a tree |
| `big-bang/inside.svg` | 첫 3분에 만들어진 것 | A circle quartered — three parts hydrogen, one part helium, by mass |
| `big-bang/change.svg` | 별이 없던 어두운 시간 | The first billion years as a bar, the stretch from 380,000 years to about 200 million painted dark |
| `big-bang/death.svg` | 우주는 어떻게 끝날까 | Four future milestones down a rule, each labelled with how many zeros its year count carries |

**Two of these say in the drawing that they are not to scale, because they
cannot be.** `size.svg` would need a sheet of paper with 26 zeros' worth of
width to draw inflation's factor honestly, so the bars measure the number of
zeros and the caption says exactly that. `death.svg` has the same trouble in
time: drawn to real proportion, "now" and "when the Sun ends" would land on one
pixel while the last two marks ran off the page, so the rows are evenly spaced
and the caption says why. The other two **are** to proportion — `inside.svg`
divides the circle by area at the real 75:25 mass ratio, and `change.svg` uses a
true linear time axis.

**`change.svg` was redrawn once.** The first version put all 13.8 billion years
on one bar, which collapsed the dark ages to nothing: 380,000 years and 200
million years landed on the same pixel and the band being illustrated was
invisible. It now shows only the first billion years and says so on the drawing.

All four were rendered at 272 px — the width they occupy in the panel — and read
before being committed.

### The four galaxies' eight new entries — added 2026-09-17 — `public/figures/`

The four galaxy topics went from two deep-dive entries each to four, and the
eight new ones needed a figure apiece. Recorded by **file path**, following the
rule set in the Big Bang section above.

#### Photographs

| File | Entry | Title / subject | Source | Credit, exactly as printed |
|---|---|---|---|---|
| `large-magellanic-cloud/supernova.webp` | 이 은하에서 터진 별과 그 앞에 온 알갱이들 | SN 1987A's ring of pearls, Hubble, released 10 June 2011 | [NASA image library `GSFC_20171208_Archive_e001896`](https://images.nasa.gov/details/GSFC_20171208_Archive_e001896) | Credit: NASA, ESA, and P. Challis (Harvard-Smithsonian Center for Astrophysics) |
| `m87/light.webp` | 한쪽으로만 뻗은 빛의 줄기 | Spitzer's infrared M87 with an inset on the jet's shock waves | [JPL Photojournal PIA23122](https://photojournal.jpl.nasa.gov/catalog/PIA23122) | NASA/JPL-Caltech/IPAC/Event Horizon Telescope Collaboration |
| `m87/size.webp` | 은하 천 개가 모인 동네의 한가운데 | A small area of the Virgo Cluster in the ultraviolet, GALEX | [JPL Photojournal PIA07906](https://photojournal.jpl.nasa.gov/catalog/PIA07906) | NASA/JPL-Caltech/SSC |

**None of the three was cropped.** Each was resized so the width is 660 px and
converted to WebP at quality 82, and the aspect ratio is the original's:
2382 × 1816 → 660 × 503, 3226 × 1814 → 660 × 371, 2274 × 2274 → 660 × 660.
An earlier draft of two captions claimed a crop; the claim was wrong and was
removed rather than left standing.

All three are false colour and each caption says so before describing anything.
`supernova.webp` is a composite of separate filters; `light.webp` maps 3.6 and
4.5 µm to blue and green and the 8 µm dust glow to red, and the caption gives
that mapping; `size.webp` is ultraviolet, and its caption also explains that the
round edge is the telescope's field of view rather than anything in the sky.
`size.webp` does **not** point out which galaxy is M87 — the NASA record says
only "a small area of the Virgo Cluster" and does not identify it, so the
caption says as much instead of guessing.

#### Diagrams drawn for this book

| File | Entry | What it shows |
|---|---|---|
| `milky-way/discover.svg` | 별 하나를 십육 년 따라가 무게를 재다 | S2's orbit round an empty focus — drawn at e ≈ 0.84, close to the star's real 0.88 |
| `milky-way/birth.svg` | 팔은 돌지 않고 물결처럼 지나간다 | A spiral arm as a traffic jam — dots crowd inside the band and spread again past it |
| `andromeda/discover.svg` | 1920년의 논쟁과 사진 건판에 적힌 느낌표 | A Cepheid's light curve over three cycles, fast rise and slow decline, one period marked 31.4 days |
| `andromeda/size.svg` | 어디까지가 은하인지 정하기 어렵다 | Two discs at the true 1:2 diameter ratio, 100,000 against 200,000 light-years |
| `large-magellanic-cloud/change.svg` | 하늘을 가로지르는 수소의 강 | The Magellanic Stream trailing the two Clouds past the Milky Way's disc |

The two that carry a real proportion say so in the caption, and the three that
do not say that too: `birth.svg` states that the spacing of the dots is not the
spacing of stars, `change.svg` that the tail's length and curve are drawn for
legibility and are not a map, and `discover.svg` that only the flattening of
the ellipse is to scale while the marked star positions were chosen to read
well. All five were rendered at 272 px — the width they occupy in the panel —
and read before being committed; four were redrawn once after that check, for
labels that collided with the footer line at that size.

### Star life's two new entries — added 2026-09-17 — `public/figures/star-life/`

Two entries were added to the fifteen already there, both with a diagram. No
photograph was needed. Recorded by file path.

| File | Entry | What it shows |
|---|---|---|
| `star-life/binary.svg` | 별은 자주 둘씩 산다 | Two stars round a shared centre of mass, orbits at the true 1:2 size ratio for a 2:1 mass ratio |
| `star-life/cluster.svg` | 구름 하나에서 함께 태어난 무리 | An open cluster beside a globular one — loose and few against dense and many |

`binary.svg` says in its caption that the ratio of the two orbits is the real
one but the drawn sizes of the two stars are not, since a star twice the mass is
nowhere near twice the width. `cluster.svg` says that the number of dots is
drawn to show the difference and is not the real star count, and that the
relative sizes of the two clusters were not measured either. Both were rendered
at 272 px and read before being committed; both were redrawn once after that
check, `binary.svg` twice — the centre-of-mass label sat on the inner orbit, and
the star labels sat on the outer one.

### The remaining eight topics' thirteen new entries — added 2026-09-17 — `public/figures/`

The eight atlas topics went from nineteen deep-dive entries between them to
thirty-two — four each — and the thirteen new ones needed a figure apiece.
Three photographs and ten diagrams, recorded by file path.

#### Photographs

| File | Entry | Title / subject | Source | Credit, exactly as printed |
|---|---|---|---|---|
| `nebulae/death.webp` | 죽어 가는 별이 만든 고리 | The Southern Ring Nebula, Webb NIRCam, 12 July 2022 | [ESA/Webb weic2207b](https://esawebb.org/images/weic2207b/) | NASA, ESA, CSA, STScI, and the Webb ERO Production Team |
| `moon/observe.webp` | 아무도 못 보던 반쪽에 가 보기 | Earthrise, Apollo 8, 24 December 1968 | [NASA image library `as08-14-2383`](https://images.nasa.gov/details/as08-14-2383) | NASA |
| `telescopes/discover.webp` | 유리 두 장에서 시작한 400년 | The ELT dome under construction, silhouetted against a rising full Moon | [ESO Picture of the Week potw2344a](https://www.eso.org/public/images/potw2344a/) | J. Beltrán/ESO |

Two were resized to 660 px and nothing else: `nebulae/death.webp`
(1280 × 1192 → 660 × 615) and `telescopes/discover.webp`
(1280 × 759 → 660 × 391). Both of those started from the archive's own
screen-size derivative rather than the full-resolution master, which at 660 px
wide loses nothing and saves downloading 96 MB for the ELT frame.
`moon/observe.webp` is the one crop: the NASA archive
frame is 3000 × 3000 and more than a third of it is empty black sky above the
Earth, so the top 1050 rows were removed (3000 × 1950 → 660 × 429) before
resizing. The frame in NASA's archive is already turned to the orientation the
picture is known by, so nothing was rotated — an earlier draft of the caption
said it had been, and the claim was removed rather than left standing.

`nebulae/death.webp` is infrared and its caption says so before describing
anything. `telescopes/discover.webp` is an ordinary photograph, and its caption
says that the dome and the Moon look the same size only because the picture was
taken from far away with a long lens. `moon/observe.webp` needs no colour note.

**A different nebula than planned.** The entry was written around M57, the Ring
Nebula, but the Webb image of it could not be located under a path that
resolves, and the entry's own paragraph on bipolar shapes names the Southern
Ring and its companion star. The figure was changed to the Southern Ring so
that the picture is the one the text actually discusses.

#### Diagrams drawn for this book

| File | Entry | What it shows |
|---|---|---|
| `black-holes/observe.svg` | 빛이 아니라 흔들림으로 듣다 | A chirp — the wave tightens and grows, then rings down |
| `exoplanets/whatis.svg` | 태양계는 표준이 아니었다 | A linear radius axis in Earth radii, with the 1–3.9 band shaded and the 1.8 valley marked |
| `moon/ushere.svg` | 바다를 끌어당기는 힘이 하는 일 | Earth stretched into two bulges, with the Moon to one side |
| `small-worlds/light.svg` | 꼬리는 뒤로 끌리지 않는다 | One comet at four points of its orbit, the tail pointing away from the Sun at every one |
| `small-worlds/size.svg` | 작은 것들이 모여 있는 두 자리 | The Sun to 50 au on a true linear scale, with the asteroid belt and the Kuiper belt as bands |
| `light/discover.svg` | 빛이 곧바로 도착하지 않는다는 발견 | Rømer's method — Earth near Jupiter and far from it, and the difference in path |
| `light/size.svg` | 138억 년인데 465억 광년 | Two circles at the true 1 : 3.37 radius ratio |
| `dark-universe/observe.svg` | 보이지 않는 것의 무게를 재는 두 가지 방법 | A rotation curve — the Keplerian fall expected, the flat line measured |
| `dark-universe/whatis.svg` | 땅속에서 기다리는 사람들 | Three branches from one question mark, each ending in "not caught yet" |
| `telescopes/size.svg` | 거울이 크면 무엇이 달라지나 | Hubble, Webb, Keck and the ELT as circles at true diameter ratio |

Four are drawn to a real proportion and say so in the caption:
`exoplanets/whatis.svg` (a linear axis in Earth radii, circles at true relative
size), `small-worlds/size.svg` (linear in astronomical units, which is why the
inner planets crowd the left edge — the drawing says so), `light/size.svg`
(465 ÷ 138 = 3.37, carried straight into the two radii) and
`telescopes/size.svg` (2.4, 6.5, 10 and 39 metres at true ratio, which is what
makes Hubble a dot).

The other six say the opposite. `black-holes/observe.svg` has no axis numbers
and says the shape alone is what matches the real signal. `moon/ushere.svg`
says the stretch is drawn far larger than it is, and that the Earth and Moon are
neither to size nor to distance. `small-worlds/light.svg` says only the tail
direction is the point. `light/discover.svg` says the orbits and bodies are not
to scale. `dark-universe/observe.svg` says the axes carry no numbers and that
real galaxies differ. `dark-universe/whatis.svg` is a list of three methods, not
a measurement.

`small-worlds/size.svg` carries one extra line, on the drawing rather than only
in the caption: the Oort cloud would need the page to run two thousand times
further to the right. It is the honest way to draw something that cannot be
drawn.

All ten were rendered at 272 px — the width they occupy in the panel — and read
before being committed. Two rounds of fixes followed that reading: labels
sitting on the curve in the chirp and the rotation curve, the 1.8 marker landing
on Neptune, a comet tail reaching the title, five distance labels piling up at
the left of the solar-system bar, one label placed off-canvas above the outer
circle in `light/size.svg`, and the 39-metre mirror covering its own title.

## Planetary figures — `src/data/planets.ts`

Radii, orbital distances, day and year lengths, temperatures and moon counts
are taken from NASA's planetary fact sheets. Facts are not copyrightable, and
NASA material is in the public domain regardless.
