export type ProductId = 'PI_XBTUSD' | 'PI_ETHUSD';

export type FeedDataPoint = [quantity: number, volume: number];

export type FeedData = {
  bids: FeedDataPoint[];
  asks: FeedDataPoint[];
};

export type FeedMessageSnapshot = FeedData & {
  feed: string;
  numLevels: number;
};

export type FeedMessageSubscribed = {
  event: 'subscribed';
  feed: string;
  product_ids: ProductId[];
};

export type FeedMessageUpdate = FeedData & {
  event: 'subscribed';
  feed: string;
  product_ids: ProductId[];
};
