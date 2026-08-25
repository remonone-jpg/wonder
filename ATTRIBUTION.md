# Third-party assets

## Planet, Sun and star textures — `public/textures/*`

From **Solar System Scope**, which builds them from NASA imagery and elevation
data (Messenger, Magellan, Blue Marble, Viking/MOLA, Juno, Cassini, Voyager 2).

- Source: https://www.solarsystemscope.com/textures/
- Licence: **CC BY 4.0** — https://creativecommons.org/licenses/by/4.0/

Not modified; served as downloaded. The credit is shown on screen in the
viewer as well as here, which is what the licence asks for.

## Planetary figures — `src/data/planets.ts`

Radii, orbital distances, day and year lengths, temperatures and moon counts
are taken from NASA's planetary fact sheets. Facts are not copyrightable, and
NASA material is in the public domain regardless.

## Interior materials — `public/textures/materials/*`

Photographed material scans from **ambientCG**: `Lava004`, `Rock030`, `Metal032`
(colour, normal and roughness maps, 1K JPG).

- Source: https://ambientcg.com/
- Licence: **CC0** — public domain, no attribution required. Credited here anyway.

These stand in for places no camera has been. The deepest hole ever drilled
reached 12km of Earth's 6371, so a planet's interior cannot be photographed the
way its surface can. The shapes and depths in `src/data/layers.ts` are the
measured ones; the materials are real rock, real lava and real iron, standing
in for rock, lava and iron nobody has seen.
