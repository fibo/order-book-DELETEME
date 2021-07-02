export type ProductId = 'PI_XBTUSD' | 'PI_ETHUSD';

export type FeedDataPoint = [price: number, amount: number];

export type FeedData = {
  asks: FeedDataPoint[];
  bids: FeedDataPoint[];
};

export type FeedAggregatedDataRecord = Record</* price: */ number, { size: number; total: number; percentage: number }>;
export type FeedAggregatedDataRow = [price: number, size: number, total: number, percentage: number];

export type FeedAggregatedData = {
  asks: FeedAggregatedDataRow[];
  bids: FeedAggregatedDataRow[];
};

export type FeedMessageSnapshot = FeedData & {
  feed: string;
  numLevels: number;
};

export type FeedMessageInfoVersion = {
  event: 'info';
  version: number;
};

export type FeedMessageSubscribe = {
  event: 'subscribe';
  feed: string;
  product_ids: ProductId[];
};

export type FeedMessageSubscribed = FeedData & {
  event: 'subscribed';
  feed: string;
  product_ids: ProductId[];
};

export type FeedMessageUpdate = FeedData & {
  event: 'subscribed';
  feed: string;
  product_ids: ProductId[];
};
