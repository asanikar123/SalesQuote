import {
  calculateQuotePricing,
  DesignationRates,
  QuoteLineItemInput,
  QuoteLineItemPricing,
} from '../pricing/calc';

export interface Quote {
  id: string;
  customerName: string;
  lineItems: QuoteLineItemInput[];
  pricedLineItems: QuoteLineItemPricing[];
  quoteTotal: number;
}

export interface QuoteInput {
  id: string;
  customerName: string;
  lineItems: QuoteLineItemInput[];
}

export interface QuoteUpdateInput {
  customerName?: string;
  lineItems?: QuoteLineItemInput[];
}

export const createQuote = (input: QuoteInput, rates: DesignationRates[]): Quote => {
  const pricing = calculateQuotePricing(input.lineItems, rates);

  return {
    id: input.id,
    customerName: input.customerName,
    lineItems: input.lineItems,
    pricedLineItems: pricing.lineItems,
    quoteTotal: pricing.quoteTotal,
  };
};

export const updateQuote = (
  existing: Quote,
  updates: QuoteUpdateInput,
  rates: DesignationRates[],
): Quote => {
  const nextLineItems = updates.lineItems ?? existing.lineItems;
  const pricing = calculateQuotePricing(nextLineItems, rates);

  return {
    ...existing,
    customerName: updates.customerName ?? existing.customerName,
    lineItems: nextLineItems,
    pricedLineItems: pricing.lineItems,
    quoteTotal: pricing.quoteTotal,
  };
};
