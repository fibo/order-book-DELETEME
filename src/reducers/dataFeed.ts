import {
  FeedData,
  FeedOrder,
  FeedAggregatedData,
  FeedAggregatedDataRow,
  FeedMessageInfoVersion,
  FeedMessageSnapshot,
  FeedMessageSubscribed,
  FeedMessageUpdate,
  OrderBook,
  OrderRecord,
  Price,
  Size,
  Total,
  Percentage,
} from '../types/feed';
import { GroupSize } from '../types/market';
import { Reducer, ReducerAction } from '../types/reducers';

type ActionType =
  | 'WEBSOCKET_CLOSED'
  | 'WEBSOCKET_CLOSING'
  | 'WEBSOCKET_CONNECTING'
  | 'WEBSOCKET_ERROR'
  | 'WEBSOCKET_OPEN'
  | 'WEBSOCKET_RECEIVE_MESSAGE';

const CONNECTING = WebSocket.CONNECTING;
const CLOSING = WebSocket.CLOSING;
const CLOSED = WebSocket.CLOSED;
const OPEN = WebSocket.OPEN;

type ReadyState = typeof CONNECTING | typeof CLOSED | typeof CLOSING | typeof OPEN;

export type DataFeedAction = ReducerAction<ActionType>;
type Action = DataFeedAction;

export type DataFeedReducer = Reducer<State, Action>;

export type WebSocketMessageReceived = Partial<FeedMessageInfoVersion> &
  Partial<FeedMessageSnapshot> &
  Partial<FeedMessageSubscribed> &
  Partial<FeedMessageUpdate>;

/*
 * State
 */

export type DataFeedState = {
  aggregatedOrderBook: FeedAggregatedData;
  feed?: string;
  connected: boolean;
  groupSize: GroupSize;
  orderBook: OrderBook;
  readyState: ReadyState | null;
};
type State = DataFeedState;

export const dataFeedInitialState = (): State => ({
  connected: false,
  aggregatedOrderBook: {
    asks: [],
    bids: [],
  },
  groupSize: 0.5,
  orderBook: {
    asks: {},
    bids: {},
  },
  readyState: null,
});

/*
 * Adapters
 */

export function feedDataToOrderBook({ asks, bids }: FeedData) {
  return {
    asks: feedOrdersToOrderRecord(asks),
    bids: feedOrdersToOrderRecord(bids),
  };
}

export function roundPrice(groupSize: GroupSize, value: number) {
  switch (groupSize) {
    case 0.5: {
      const base = Math.floor(value);
      const rest = value - base;
      return rest >= groupSize ? base + groupSize : base;
    }

    case 1: {
      return Math.floor(value);
    }

    default:
      return value;
  }
}

// filter util
const ordersToBeRemoved = ([, size]: FeedOrder) => size === 0;

// reducer util
export function feedOrdersToOrderRecord(orders: FeedOrder[]): OrderRecord {
  return orders.reduce((orderRecord, [price, size]) => ({ ...orderRecord, [price]: size }), {});
}

function aggregatedOrderBook(groupSize: GroupSize, record: OrderRecord): FeedAggregatedDataRow[] {
  const aggregate: Record<Price, { size: Size; total: Total; percentage: Percentage }> = {};

  for (const [price, size] of Object.entries(record)) {
    const roundedPrice = roundPrice(groupSize, Number(price));

    if (typeof aggregate[roundedPrice] === 'undefined') {
      aggregate[roundedPrice] = { size, total: 0, percentage: 0 };
    } else {
      aggregate[roundedPrice] = { size: aggregate[roundedPrice].size + size, total: 0, percentage: 0 };
    }
  }

  return Object.entries(aggregate)
    .sort(([priceA], [priceB]) => {
      if (priceA < priceB) return 1;
      if (priceA > priceB) return -1;
      return 0;
    })
    .map(([price, { size, total, percentage }]) => [Number(price), size, total, percentage]);
}

function aggregateFeedData(groupSize: GroupSize, { asks, bids }: OrderBook): FeedAggregatedData {
  return {
    asks: aggregatedOrderBook(groupSize, asks),
    bids: aggregatedOrderBook(groupSize, bids),
  };
}

/*
 * Selectors
 */

export const selectWebSocketIsOpen = (state: State) => state.readyState === WebSocket.OPEN;

export const selectWebSocketReadyState = (state: State) => state.readyState;

export const selectDataFeedIsConnected = (state: State) => state.connected;

export const selectDataFeedGroupSize = (state: State) => state.groupSize;

export const selectOrderBookAggregatedData = (state: State) => state.aggregatedOrderBook;

export const selectOrderBookData = (state: State) => state.orderBook;

/*
 * Reducer
 */

export function dataFeedReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'WEBSOCKET_CLOSED': {
      return {
        ...state,
        readyState: CLOSED,
      };
    }

    case 'WEBSOCKET_CLOSING': {
      return {
        ...state,
        readyState: CLOSING,
      };
    }

    case 'WEBSOCKET_CONNECTING': {
      return {
        ...state,
        readyState: CONNECTING,
      };
    }

    case 'WEBSOCKET_ERROR': {
      return state;
    }

    case 'WEBSOCKET_OPEN': {
      return {
        ...state,
        readyState: OPEN,
      };
    }

    case 'WEBSOCKET_RECEIVE_MESSAGE': {
      try {
        const data = typeof action.data === 'string' ? (JSON.parse(action.data) as WebSocketMessageReceived) : {};

        const isInfoVersion = data.event === 'info';
        const hasSubscribedEvent = data.event === 'subscribed';
        const hasFeedName = typeof data.feed === 'string' && data.feed.length > 0;
        const hasAsks = Array.isArray(data.asks);
        const hasBids = Array.isArray(data.bids);
        const hasOrderBook = hasAsks && hasBids;
        const isSnapshot = hasFeedName && (data.feed as string).endsWith('_snapshot');

        switch (true) {
          // First message.
          case isInfoVersion: {
            return {
              ...state,
              connected: true,
            };
          }

          // Subsribed event.
          case hasSubscribedEvent && hasFeedName: {
            return {
              ...state,
              feed: data.feed,
            };
          }

          // Initial snapshot.
          case isSnapshot && hasOrderBook: {
            const groupSize = selectDataFeedGroupSize(state);
            const orderBook = feedDataToOrderBook(data as FeedData);

            return {
              ...state,
              orderBook,
              aggregatedOrderBook: aggregateFeedData(groupSize, orderBook),
            };
          }

          // Diff data message.
          case hasOrderBook && !isSnapshot: {
            const { asks, bids } = data as FeedData;

            const groupSize = selectDataFeedGroupSize(state);
            const { asks: previousAsks, bids: previousBids } = selectOrderBookData(state);

            const asksToBeRemoved = feedOrdersToOrderRecord(asks.filter(ordersToBeRemoved));
            console.log(asksToBeRemoved);
            const bidsToBeRemoved = feedOrdersToOrderRecord(bids.filter(ordersToBeRemoved));

            const asksToKeep = [] as FeedOrder[];
            const bidsToKeep = [] as FeedOrder[];

            Object.entries(previousAsks).forEach(([price, size]) => {
              if (typeof asksToBeRemoved[Number(price)] !== 'undefined') {
                asksToKeep.push([Number(price), size]);
              }
            });

            Object.entries(previousBids).forEach(([price, size]) => {
              if (typeof bidsToBeRemoved[Number(price)] !== 'undefined') {
                bidsToKeep.push([Number(price), size]);
              }
            });

            const orderBook = feedDataToOrderBook({
              // asks with updated size will overwrite asksToKeep
              // same for bids
              asks: asksToKeep.concat(asks),
              bids: bidsToKeep.concat(bids),
            });

            return {
              ...state,
              orderBook,
              aggregatedOrderBook: aggregateFeedData(groupSize, orderBook),
            };
          }

          default: {
            return state;
          }
        }
      } catch (error) {
        console.error(error);
        return state;
      }
    }

    default: {
      return state;
    }
  }
}
