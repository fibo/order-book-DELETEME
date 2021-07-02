export type ProductId = 'PI_XBTUSD' | 'PI_ETHUSD';

export type Price = number;
export type Size = number;
export type Total = number;
export type Percentage = number;

export type FeedOrder = [price: Price, size: Size];
export type OrderRecord = Record<Price, Size>;

export type FeedData = {
  asks: FeedOrder[];
  bids: FeedOrder[];
};

export type OrderBook = {
  asks: OrderRecord;
  bids: OrderRecord;
};

export type FeedAggregatedDataRow = [price: Price, size: Size, total: Total, percentage: Percentage];

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
