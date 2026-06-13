export const PLOT_LABELS = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"] as const;

/**
 * 8-plot grid laid out in a 100x100 SVG viewBox, with a horizontal internal
 * road and a vertical entrance road at the bottom center.
 */
export const PLOT_POINTS: Record<string, string> = {
  P1: "1,2 24,2 24,44 1,44",
  P2: "26,2 49,2 49,44 26,44",
  P3: "51,2 74,2 74,44 51,44",
  P4: "76,2 99,2 99,44 76,44",
  P5: "1,56 24,56 24,98 1,98",
  P6: "26,56 49,56 49,98 26,98",
  P7: "51,56 74,56 74,98 51,98",
  P8: "76,56 99,56 99,98 76,98",

  // Vertical strip of 8 plots along the project road (ปากช่อง, 5 ไร่)
  A8: "8,2 99,2 99,17.07 8,17.07",
  A7: "8,17.07 99,17.07 99,28.52 8,28.52",
  A6: "8,28.52 99,28.52 99,39.97 8,39.97",
  A5: "8,39.97 99,39.97 99,51.42 8,51.42",
  A4: "8,51.42 99,51.42 99,62.87 8,62.87",
  A3: "8,62.87 99,62.87 99,74.32 8,74.32",
  A2: "8,74.32 99,74.32 99,85.77 8,85.77",
  A1: "8,85.77 99,85.77 99,98 8,98",
};

export interface RoadRect {
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  labelX?: number;
  labelY?: number;
  labelRotate?: number;
}

/** Internal road + entrance for the 2x4 grid layout (P1-P8). */
export const GRID_ROADS: RoadRect[] = [
  { x: 0, y: 46, width: 100, height: 8 },
  { x: 46, y: 54, width: 8, height: 46, label: "ทางเข้าโครงการ", labelX: 50, labelY: 99 },
];

/** Project road running along the row of plots (A1-A8). */
export const STRIP_ROADS: RoadRect[] = [
  { x: 0, y: 0, width: 8, height: 100, label: "ถนนโครงการ 8 ม.", labelX: 4, labelY: 50, labelRotate: -90 },
];

export function getRoadsForPlots(labels: string[]): RoadRect[] {
  return labels.some((label) => label.startsWith("A")) ? STRIP_ROADS : GRID_ROADS;
}

export function defaultPerspectiveImages(seedPrefix: string) {
  return JSON.stringify([
    { label: "มุมมองจากถนน", url: `https://picsum.photos/seed/${seedPrefix}-road/900/600` },
    { label: "มองเข้าสู่แปลง", url: `https://picsum.photos/seed/${seedPrefix}-into/900/600` },
    { label: "มองออกจากแปลง", url: `https://picsum.photos/seed/${seedPrefix}-out/900/600` },
    { label: "มุมมองด้านข้าง", url: `https://picsum.photos/seed/${seedPrefix}-corner/900/600` },
  ]);
}

/**
 * Real on-site "view from road" photos exist for all Pak Chong plots (A1-A8).
 * Until other angles are shot, every perspective slot reuses that same photo.
 */
export function pakChongPerspectiveImages(label: string) {
  const url = `/listings/pakchong-musi/plots/${label.toLowerCase()}-road.jpg`;
  return JSON.stringify([
    { label: "มุมมองจากถนน", url },
    { label: "มองเข้าสู่แปลง", url },
    { label: "มองออกจากแปลง", url },
    { label: "มุมมองด้านข้าง", url },
  ]);
}

export interface PerspectiveImage {
  label: string;
  url: string;
}

export function parsePerspectiveImages(json: string): PerspectiveImage[] {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) return parsed as PerspectiveImage[];
    return [];
  } catch {
    return [];
  }
}
