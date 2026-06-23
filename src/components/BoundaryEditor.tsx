"use client";

import { useState, useRef, useCallback } from "react";

interface Point {
  x: number;
  y: number;
}

function pointsToString(pts: Point[]): string {
  return pts.map((p) => `${Math.round(p.x * 100) / 100},${Math.round(p.y * 100) / 100}`).join(" ");
}

function parsePoints(str: string): Point[] {
  if (!str.trim()) return [];
  return str
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [x, y] = pair.split(",").map(Number);
      return { x, y };
    })
    .filter((p) => !isNaN(p.x) && !isNaN(p.y));
}

export function BoundaryEditor({
  surveyImageUrl,
  initialBoundary,
  onChange,
}: {
  surveyImageUrl?: string | null;
  initialBoundary?: string | null;
  onChange?: (pointsString: string) => void;
}) {
  const [points, setPoints] = useState<Point[]>(() => parsePoints(initialBoundary ?? ""));
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const updatePoints = useCallback(
    (next: Point[]) => {
      setPoints(next);
      onChange?.(pointsToString(next));
    },
    [onChange],
  );

  function toSvgCoords(e: React.MouseEvent<SVGSVGElement>): Point {
    const svg = svgRef.current!;
    const ctm = svg.getScreenCTM()!;
    return {
      x: (e.clientX - ctm.e) / ctm.a,
      y: (e.clientY - ctm.f) / ctm.d,
    };
  }

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    if (draggingIndex !== null) return;
    const target = e.target as Element;
    if (target.closest("[data-handle]")) return;
    const pt = toSvgCoords(e);
    updatePoints([...points, pt]);
  }

  function handleMouseDown(index: number, e: React.MouseEvent) {
    e.stopPropagation();
    setDraggingIndex(index);
  }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (draggingIndex === null) return;
    const pt = toSvgCoords(e);
    const next = [...points];
    next[draggingIndex] = pt;
    updatePoints(next);
  }

  function handleMouseUp() {
    setDraggingIndex(null);
  }

  function handleDoubleClick(index: number, e: React.MouseEvent) {
    e.stopPropagation();
    updatePoints(points.filter((_, i) => i !== index));
  }

  const polyString = pointsToString(points);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground/70">
          วาดขอบเขตที่ดิน (คลิกเพื่อเพิ่มจุด, ลากเพื่อย้าย, ดับเบิลคลิกเพื่อลบจุด)
        </p>
        {points.length > 0 && (
          <button
            type="button"
            onClick={() => updatePoints([])}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            ล้าง
          </button>
        )}
      </div>

      <input type="hidden" name="boundaryPoints" value={polyString} />

      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        className="aspect-square w-full cursor-crosshair rounded-xl border border-primary-200 bg-zinc-100"
        preserveAspectRatio="xMidYMid meet"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {surveyImageUrl && (
          <image
            href={surveyImageUrl}
            x="0"
            y="0"
            width="100"
            height="100"
            preserveAspectRatio="xMidYMid meet"
            opacity={0.4}
          />
        )}

        {points.length >= 3 && (
          <polygon
            points={polyString}
            fill="#92400e"
            fillOpacity={0.08}
            stroke="#92400e"
            strokeWidth={0.6}
            strokeDasharray="2,1"
          />
        )}

        {points.length === 2 && (
          <line
            x1={points[0].x}
            y1={points[0].y}
            x2={points[1].x}
            y2={points[1].y}
            stroke="#92400e"
            strokeWidth={0.5}
            strokeDasharray="2,1"
          />
        )}

        {points.map((pt, i) => (
          <circle
            key={i}
            data-handle="true"
            cx={pt.x}
            cy={pt.y}
            r={1.8}
            fill="#ffffff"
            stroke="#92400e"
            strokeWidth={0.5}
            className="cursor-grab"
            onMouseDown={(e) => handleMouseDown(i, e)}
            onDoubleClick={(e) => handleDoubleClick(i, e)}
          />
        ))}
      </svg>

      {points.length > 0 && points.length < 3 && (
        <p className="text-xs text-foreground/50">เพิ่มอีก {3 - points.length} จุดเพื่อสร้างขอบเขต</p>
      )}
    </div>
  );
}
