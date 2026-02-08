export type RateType = 'onshore' | 'offshore';

export interface DesignationRates {
  designation: string;
  onshoreRate: number;
  offshoreRate: number;
}

export interface QuoteLineItemInput {
  designation: string;
  hours: number;
  rateType: RateType;
  rateOverride?: number;
}

export interface QuoteLineItemPricing {
  designation: string;
  hours: number;
  rateType: RateType;
  hourlyRate: number;
  monthlyRate: number;
  lineTotal: number;
}

export interface QuotePricingResult {
  lineItems: QuoteLineItemPricing[];
  quoteTotal: number;
}

const buildRateLookup = (rates: DesignationRates[]): Map<string, DesignationRates> => {
  return new Map(rates.map((rate) => [rate.designation, rate]));
};

const resolveHourlyRate = (
  line: QuoteLineItemInput,
  rateLookup: Map<string, DesignationRates>,
): number => {
  if (line.rateOverride !== undefined) {
    return line.rateOverride;
  }

  const designationRate = rateLookup.get(line.designation);
  if (!designationRate) {
    throw new Error(`Missing rate configuration for designation: ${line.designation}`);
  }

  return line.rateType === 'onshore' ? designationRate.onshoreRate : designationRate.offshoreRate;
};

export const calculateQuotePricing = (
  lineItems: QuoteLineItemInput[],
  rates: DesignationRates[],
): QuotePricingResult => {
  const lookup = buildRateLookup(rates);

  const pricedLineItems = lineItems.map((line) => {
    const hourlyRate = resolveHourlyRate(line, lookup);
    const monthlyRate = hourlyRate * line.hours;
    const lineTotal = monthlyRate;

    return {
      designation: line.designation,
      hours: line.hours,
      rateType: line.rateType,
      hourlyRate,
      monthlyRate,
      lineTotal,
    };
  });

  const quoteTotal = pricedLineItems.reduce((total, line) => total + line.lineTotal, 0);

  return {
    lineItems: pricedLineItems,
    quoteTotal,
  };
};
