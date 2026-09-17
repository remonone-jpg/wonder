export type InteriorLayer = {
  readonly id: string;
  readonly radiusKm: number;
  readonly color: number;
};

export type InteriorStage = {
  readonly bodyId: "earth" | "mars" | "jupiter" | "saturn";
  readonly layers: readonly InteriorLayer[];
};

export const INTERIOR_STAGES = [
  {
    bodyId: "earth",
    layers: [
      { id: "inner-core", radiusKm: 1221.5, color: 0xffe7a0 },
      { id: "outer-core", radiusKm: 3480, color: 0xffad53 },
      { id: "mantle", radiusKm: 6331, color: 0x703627 },
      { id: "crust", radiusKm: 6371, color: 0x454343 },
    ],
  },
  {
    bodyId: "mars",
    layers: [
      { id: "core", radiusKm: 1675, color: 0xffd98a },
      { id: "molten-silicate", radiusKm: 1825, color: 0xf49c44 },
      { id: "mantle", radiusKm: 3339.5, color: 0x9b4e42 },
      { id: "crust", radiusKm: 3389.5, color: 0xd88861 },
    ],
  },
  {
    bodyId: "jupiter",
    layers: [
      { id: "dilute-core", radiusKm: 34955.5, color: 0xf4bb79 },
      { id: "metallic-envelope", radiusKm: 55928.8, color: 0xaaa49b },
      { id: "molecular-envelope", radiusKm: 69911, color: 0xd4ae88 },
    ],
  },
  {
    bodyId: "saturn",
    layers: [
      { id: "diffuse-core", radiusKm: 34939.2, color: 0xb78a55 },
      { id: "envelope", radiusKm: 58232, color: 0xdec284 },
    ],
  },
] as const satisfies readonly InteriorStage[];
