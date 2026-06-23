"use client";

import { useState } from "react";
import { SubdivisionMap } from "@/components/SubdivisionMap";
import { PlotDetailPanel, type PlotDetailData } from "@/components/PlotDetailPanel";
import { PLOT_STATUS_LABELS } from "@/lib/format";
import { getRoadsForPlots } from "@/lib/subdivision";

export function SubdivisionExplorer({
  plots,
  boundary,
}: {
  plots: PlotDetailData[];
  boundary?: string | null;
}) {
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(plots[0]?.id ?? null);
  const roads = boundary ? [] : getRoadsForPlots(plots.map((p) => p.label));

  const selectedPlot = plots.find((p) => p.id === selectedPlotId) ?? null;

  const counts = {
    AVAILABLE: plots.filter((p) => p.status === "AVAILABLE").length,
    RESERVED: plots.filter((p) => p.status === "RESERVED").length,
    SOLD: plots.filter((p) => p.status === "SOLD").length,
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex flex-col gap-4 lg:w-2/3">
        <div className="rounded-2xl border border-primary-100 bg-white p-4 shadow-sm">
          <div className="aspect-[5/4] w-full">
            <SubdivisionMap
              plots={plots}
              selectedPlotId={selectedPlotId}
              onSelectPlot={setSelectedPlotId}
              roads={roads}
              boundary={boundary}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm">
            <span className="h-3 w-3 rounded-full bg-[#22c55e]" />
            {PLOT_STATUS_LABELS.AVAILABLE} ({counts.AVAILABLE})
          </span>
          <span className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm">
            <span className="h-3 w-3 rounded-full bg-[#f97316]" />
            {PLOT_STATUS_LABELS.RESERVED} ({counts.RESERVED})
          </span>
          <span className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm">
            <span className="h-3 w-3 rounded-full bg-[#ef4444]" />
            {PLOT_STATUS_LABELS.SOLD} ({counts.SOLD})
          </span>
        </div>
      </div>

      <div className="lg:w-1/3">
        <div className="lg:sticky lg:top-24">
          <PlotDetailPanel plot={selectedPlot} />
        </div>
      </div>
    </div>
  );
}
