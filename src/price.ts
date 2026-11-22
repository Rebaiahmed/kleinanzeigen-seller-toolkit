/** Illustrative rules, not observations of Kleinanzeigen or any other market. */
export const PRICE_RULES = {
  condition: {
    neu: 0.86,
    sehrGut: 0.72,
    gut: 0.58,
    akzeptabel: 0.38,
    defekt: 0.16,
  },
  yearlyRetention: 0.88,
  minimumAgeFactor: 0.35,
  rangeWidth: 0.15,
} as const;

export type Condition = keyof typeof PRICE_RULES.condition;

export interface PriceInput {
  purchasePrice: number;
  condition: Condition;
  ageYears: number;
  targetPrice?: number;
}

export interface PriceEstimate {
  low: number;
  high: number;
  midpoint: number;
  conditionFactor: number;
  ageFactor: number;
  targetPosition?: 'below' | 'within' | 'above';
}

export function estimatePrice(input: PriceInput): PriceEstimate {
  if (!Number.isFinite(input.purchasePrice) || input.purchasePrice <= 0 || input.purchasePrice > 1_000_000) {
    throw new RangeError('Der ursprüngliche Kaufpreis muss zwischen 0 und 1.000.000 € liegen.');
  }
  if (!Number.isFinite(input.ageYears) || input.ageYears < 0 || input.ageYears > 50) {
    throw new RangeError('Das Alter muss zwischen 0 und 50 Jahren liegen.');
  }
  if (!(input.condition in PRICE_RULES.condition)) {
    throw new RangeError('Bitte einen gültigen Zustand wählen.');
  }
  if (input.targetPrice !== undefined && (!Number.isFinite(input.targetPrice) || input.targetPrice < 0 || input.targetPrice > 1_000_000)) {
    throw new RangeError('Der Wunschpreis muss zwischen 0 und 1.000.000 € liegen.');
  }

  const conditionFactor = PRICE_RULES.condition[input.condition];
  const ageFactor = Math.max(PRICE_RULES.minimumAgeFactor, PRICE_RULES.yearlyRetention ** input.ageYears);
  const midpoint = input.purchasePrice * conditionFactor * ageFactor;
  const low = Math.max(0, Math.round(midpoint * (1 - PRICE_RULES.rangeWidth)));
  const high = Math.round(midpoint * (1 + PRICE_RULES.rangeWidth));
  const result: PriceEstimate = { low, high, midpoint: Math.round(midpoint), conditionFactor, ageFactor };
  if (input.targetPrice !== undefined) {
    result.targetPosition = input.targetPrice < low ? 'below' : input.targetPrice > high ? 'above' : 'within';
  }
  return result;
}
