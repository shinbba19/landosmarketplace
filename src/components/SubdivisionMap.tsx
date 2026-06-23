"use client";

import { PLOT_STATUS_COLORS } from "@/lib/format";
import { GRID_ROADS, type RoadRect } from "@/lib/subdivision";

export interface SubdivisionMapPlot {
  id: string;
  label: string;
  points: string;
  status: string;
}

export function SubdivisionMap({
  plots,
  selectedPlotId,
  onSelectPlot,
  roads = GRID_ROADS,
  boundary,
}: {
  plots: SubdivisionMapPlot[];
  selectedPlotId?: string | null;
  onSelectPlot?: (plotId: string) => void;
  roads?: RoadRect[];
  boundary?: string | null;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full rounded-xl bg-zinc-100"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Land boundary */}
      {boundary && (
        <polygon
          points={boundary}
          fill="#92400e"
          fillOpacity={0.06}
          stroke="#92400e"
          strokeWidth={0.8}
          strokeDasharray="2,1"
        />
      )}

      {/* Internal roads */}
      {roads.map((road, i) => (
        <g key={i}>
          <rect x={road.x} y={road.y} width={road.width} height={road.height} fill="#d4d4d8" />
          {road.label && (
            <text
              x={road.labelX ?? road.x + road.width / 2}
              y={road.labelY ?? road.y + road.height / 2}
              textAnchor="middle"
              fontSize={2.5}
              fill="#71717a"
              transform={
                road.labelRotate
                  ? `rotate(${road.labelRotate} ${road.labelX} ${road.labelY})`
                  : undefined
              }
            >
              {road.label}
            </text>
          )}
        </g>
      ))}

      {plots.map((plot) => {
        const colors = PLOT_STATUS_COLORS[plot.status] ?? PLOT_STATUS_COLORS.AVAILABLE;
        const isSelected = plot.id === selectedPlotId;
        const points = plot.points.split(" ").map((p) => p.split(",").map(Number));
        const cx = points.reduce((sum, p) => sum + p[0], 0) / points.length;
        const cy = points.reduce((sum, p) => sum + p[1], 0) / points.length;

        return (
          <g
            key={plot.id}
            onClick={() => onSelectPlot?.(plot.id)}
            className={onSelectPlot ? "cursor-pointer" : ""}
          >
            <polygon
              points={plot.points}
              fill={colors.fill}
              fillOpacity={isSelected ? 0.9 : 0.65}
              stroke={isSelected ? "#1a2e22" : "#ffffff"}
              strokeWidth={isSelected ? 1.2 : 0.6}
            />
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={5}
              fontWeight={700}
              fill="#ffffff"
            >
              {plot.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
