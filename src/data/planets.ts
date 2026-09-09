import type { Body, BodyId } from "./types";

/**
 * The solar system, in real numbers.
 *
 * Every figure here is measured, not chosen to look good: radii in kilometres,
 * orbits in astronomical units, days and years as they actually are. The scene
 * derives its geometry from these, which is what makes the "true scale" view
 * worth showing — the crowding you see in every picture book is a lie the
 * numbers immediately expose.
 *
 * Sources: NASA planetary fact sheets.
 */

export const bodies: Body[] = [
  { id: "sun",     radiusKm: 696340, orbitAu: 0,      dayHours: 587.5,  yearDays: 0,      tempC: 5500,  moons: 0,  tint: "#ffb84d", texture: "/textures/sun.jpg",          tiltDeg: 7.25 },
  { id: "mercury", radiusKm: 2439.7, orbitAu: 0.387,  dayHours: 1407.6, yearDays: 88,     tempC: 167,   moons: 0,  tint: "#a89787", texture: "/textures/mercury.jpg",      tiltDeg: 0.03 },
  { id: "venus",   radiusKm: 6051.8, orbitAu: 0.723,  dayHours: -5832.5, yearDays: 224.7, tempC: 464,   moons: 0,  tint: "#e6c07a", texture: "/textures/venus_surface.jpg", cloudTexture: "/textures/venus_atmosphere.jpg", tiltDeg: 177.4 },
  { id: "earth",   radiusKm: 6371,   orbitAu: 1,      dayHours: 23.9,   yearDays: 365.25, tempC: 15,    moons: 1,  tint: "#6b93d6", texture: "/textures/earth_daymap.jpg",  cloudTexture: "/textures/earth_clouds.jpg", tiltDeg: 23.4 },
  { id: "mars",    radiusKm: 3389.5, orbitAu: 1.524,  dayHours: 24.6,   yearDays: 687,    tempC: -65,   moons: 2,  tint: "#c1440e", texture: "/textures/mars.jpg",         tiltDeg: 25.2 },
  { id: "jupiter", radiusKm: 69911,  orbitAu: 5.203,  dayHours: 9.9,    yearDays: 4333,   tempC: -110,  moons: 95, tint: "#d8ca9d", texture: "/textures/jupiter.jpg",      tiltDeg: 3.1 },
  { id: "saturn",  radiusKm: 58232,  orbitAu: 9.537,  dayHours: 10.7,   yearDays: 10759,  tempC: -140,  moons: 146, tint: "#ead6b8", texture: "/textures/saturn.jpg",      ringTexture: "/textures/saturn_ring_alpha.png", tiltDeg: 26.7 },
  { id: "uranus",  radiusKm: 25362,  orbitAu: 19.191, dayHours: -17.2,  yearDays: 30687,  tempC: -195,  moons: 28, tint: "#a8d8e8", texture: "/textures/uranus.jpg",       tiltDeg: 97.8 },
  { id: "neptune", radiusKm: 24622,  orbitAu: 30.07,  dayHours: 16.1,   yearDays: 60190,  tempC: -200,  moons: 16, tint: "#5b7ff5", texture: "/textures/neptune.jpg",      tiltDeg: 28.3 },
];

export const byId = Object.fromEntries(bodies.map((b) => [b.id, b])) as Record<BodyId, Body>;

/** The Moon is not a planet, but it is the one a child has actually seen. */
export const MOON = { radiusKm: 1737.4, orbitFromEarthKm: 384400, texture: "/textures/moon.jpg" };

export const AU_KM = 149_597_870;
