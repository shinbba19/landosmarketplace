interface Point {
  x: number;
  y: number;
}

function parseBoundary(pointsStr: string): Point[] {
  return pointsStr
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [x, y] = pair.split(",").map(Number);
      return { x, y };
    });
}

function boundingBox(pts: Point[]) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY };
}

function pointInPolygon(x: number, y: number, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function rectCornersInside(x: number, y: number, w: number, h: number, polygon: Point[]): boolean {
  return (
    pointInPolygon(x, y, polygon) &&
    pointInPolygon(x + w, y, polygon) &&
    pointInPolygon(x, y + h, polygon) &&
    pointInPolygon(x + w, y + h, polygon)
  );
}

const ROAD_GAP = 1.5;
const PADDING = 1;

/**
 * Generate plot rectangles that fit inside a boundary polygon.
 * Returns SVG points strings for each plot, in the same 100x100 coordinate space.
 */
export function generatePlotsInBoundary(
  boundaryPointsStr: string,
  numPlots: number,
): string[] {
  const boundary = parseBoundary(boundaryPointsStr);
  if (boundary.length < 3 || numPlots <= 0) return [];

  const bb = boundingBox(boundary);
  const innerX = bb.minX + PADDING;
  const innerY = bb.minY + PADDING;
  const innerW = bb.maxX - bb.minX - PADDING * 2;
  const innerH = bb.maxY - bb.minY - PADDING * 2;

  if (innerW <= 0 || innerH <= 0) return [];

  const aspect = innerW / innerH;

  // Pick grid that best matches the boundary aspect ratio
  let bestCols = 1;
  let bestRows = numPlots;
  let bestScore = -1;

  for (let cols = 1; cols <= numPlots; cols++) {
    const rows = Math.ceil(numPlots / cols);
    const cellW = (innerW - ROAD_GAP * (cols - 1)) / cols;
    const cellH = (innerH - ROAD_GAP * (rows - 1)) / rows;
    if (cellW <= 0 || cellH <= 0) continue;
    // Prefer squarish cells that also match the bounding box shape
    const gridAspect = (cols * (cellW + ROAD_GAP)) / (rows * (cellH + ROAD_GAP));
    const aspectFit = 1 / (1 + Math.abs(Math.log(gridAspect / aspect)));
    const cellSquareness = 1 / (1 + Math.abs(Math.log(cellW / cellH)));
    const score = aspectFit * 2 + cellSquareness + cellW * cellH * 0.001;
    if (score > bestScore) {
      bestScore = score;
      bestCols = cols;
      bestRows = rows;
    }
  }

  const cellW = (innerW - ROAD_GAP * (bestCols - 1)) / bestCols;
  const cellH = (innerH - ROAD_GAP * (bestRows - 1)) / bestRows;

  const results: string[] = [];
  for (let row = 0; row < bestRows && results.length < numPlots; row++) {
    for (let col = 0; col < bestCols && results.length < numPlots; col++) {
      const x = innerX + col * (cellW + ROAD_GAP);
      const y = innerY + row * (cellH + ROAD_GAP);

      const r = (v: number) => Math.round(v * 100) / 100;
      results.push(
        `${r(x)},${r(y)} ${r(x + cellW)},${r(y)} ${r(x + cellW)},${r(y + cellH)} ${r(x)},${r(y + cellH)}`,
      );
    }
  }

  return results;
}
