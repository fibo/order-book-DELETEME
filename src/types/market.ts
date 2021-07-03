export type MarketSide = 'buy' | 'sell';

export type EthGroupSize = 0.05 | 0.1 | 0.25;
export type XbtGroupSize = 0.5 | 1 | 2.5;
export type GroupSize = EthGroupSize | XbtGroupSize;
export type GroupSizeList = EthGroupSize[] | XbtGroupSize[];
