export type Recommendation =
  | "SELL_WHOLE"
  | "CONSIDER_SUBDIVISION"
  | "REQUIRES_REVIEW";

export const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
  SELL_WHOLE: "ขายยกแปลง",
  CONSIDER_SUBDIVISION: "พิจารณาแบ่งแปลงขาย",
  REQUIRES_REVIEW: "ควรขอคำปรึกษาจากผู้เชี่ยวชาญ",
};

export interface FeasibilityInputs {
  landArea: number;
  wholeLandPrice: number;
  wholeLandSalePrice: number;
  numberOfPlots: number;
  pricePerSqWah: number;
}

export interface FeasibilityOutputs {
  avgPlotPrice: number;
  roadCost: number;
  infrastructureCost: number;
  marketingCost: number;
  wholeLandRevenue: number;
  subdivisionRevenue: number;
  developmentCost: number;
  netProfit: number;
  roi: number;
  profitDifference: number;
  recommendation: Recommendation;
}

/**
 * Recommendation switches to CONSIDER_SUBDIVISION / SELL_WHOLE only once the
 * profit difference clears this fraction of the whole-land revenue; smaller
 * differences are treated as too close to call without expert review.
 */
const REVIEW_THRESHOLD_RATIO = 0.1;

/** 1 ไร่ = 400 ตารางวา */
export const SQ_WAH_PER_RAI = 400;

/** Share of land area reserved for internal roads when subdividing. */
export const ROAD_AREA_RATIO = 0.1;

/** Infrastructure (utilities) cost, as a share of the whole-land price. */
export const INFRASTRUCTURE_COST_RATIO = 0.1;

/** Admin/marketing cost, as a share of the whole-land price. */
export const ADMIN_COST_RATIO = 0.05;

export function calculateFeasibility(
  inputs: FeasibilityInputs
): FeasibilityOutputs {
  const { landArea, wholeLandPrice, wholeLandSalePrice, numberOfPlots, pricePerSqWah } = inputs;

  const sellableAreaSqWah = landArea * SQ_WAH_PER_RAI * (1 - ROAD_AREA_RATIO);
  const avgPlotPrice =
    numberOfPlots > 0 ? (sellableAreaSqWah / numberOfPlots) * pricePerSqWah : 0;

  const roadCost = 0;
  const infrastructureCost = wholeLandPrice * INFRASTRUCTURE_COST_RATIO;
  const marketingCost = wholeLandPrice * ADMIN_COST_RATIO;
  const developmentCost = wholeLandPrice + roadCost + infrastructureCost + marketingCost;

  const wholeLandRevenue = wholeLandSalePrice > 0 ? wholeLandSalePrice : wholeLandPrice;
  const subdivisionRevenue = numberOfPlots * avgPlotPrice;
  const netProfit = subdivisionRevenue - developmentCost;
  const roi = developmentCost > 0 ? (netProfit / developmentCost) * 100 : 0;
  const profitDifference = netProfit - wholeLandRevenue;

  const threshold = wholeLandRevenue * REVIEW_THRESHOLD_RATIO;

  let recommendation: Recommendation;
  if (profitDifference > threshold) {
    recommendation = "CONSIDER_SUBDIVISION";
  } else if (profitDifference < -threshold) {
    recommendation = "SELL_WHOLE";
  } else {
    recommendation = "REQUIRES_REVIEW";
  }

  return {
    avgPlotPrice,
    roadCost,
    infrastructureCost,
    marketingCost,
    wholeLandRevenue,
    subdivisionRevenue,
    developmentCost,
    netProfit,
    roi,
    profitDifference,
    recommendation,
  };
}
