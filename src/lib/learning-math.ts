export const LIGHT_KM_S = 299792.458;
export const AU_KM_EXACT = 149597870.7;
export const lightSeconds = (au: number) => au * AU_KM_EXACT / LIGHT_KM_S;
/** Signed sidereal period includes retrograde rotation. */
export function solarDayHours(rotationHours: number, orbitDays: number) {
  if (orbitDays <= 0) return null;
  return 1 / Math.abs(1 / rotationHours - 1 / (orbitDays * 24));
}
/** Uniform-brightness star of radius 1; exact circle overlap, no limb darkening. */
export function transitDepth(radius: number, distance: number) {
  const r = Math.max(0, Math.min(1, radius)), d = Math.abs(distance);
  if (d >= 1 + r) return 0;
  if (d <= 1 - r) return r * r;
  const a = Math.acos(Math.max(-1, Math.min(1, (d*d + r*r - 1) / (2*d*r))));
  const b = Math.acos(Math.max(-1, Math.min(1, (d*d + 1 - r*r) / (2*d))));
  const area = r*r*a + b - .5 * Math.sqrt(Math.max(0, (-d+r+1)*(d+r-1)*(d-r+1)*(d+r+1)));
  return area / Math.PI;
}
