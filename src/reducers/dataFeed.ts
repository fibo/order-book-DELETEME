import {
  FeedData,
  FeedDataPoint,
  FeedAggregatedData,
  FeedAggregatedDataRecord,
  FeedAggregatedDataRow,
  FeedMessageInfoVersion,
  FeedMessageSnapshot,
  FeedMessageSubscribed,
  FeedMessageUpdate,
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
  orderBook: FeedData;
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
    asks: [],
    bids: [],
  },
  readyState: null,
});

/*
 * Adapters
 */

function roundPrice(groupSize: GroupSize, value: number) {
  switch (groupSize) {
    case 1:
      return Math.round(value);
    default:
      return value;
  }
}

// reducer util
function toAggregatedDataRecord(groupSize: GroupSize) {
  return function (result: FeedAggregatedDataRecord, dataPoint: FeedDataPoint) {
    const [price, size] = dataPoint;
    const roundedPrice = roundPrice(groupSize, price);

    if (typeof result[roundedPrice] === 'undefined') {
      result[roundedPrice] = {
        size,
        total: groupSize,
        percentage: 10,
      };
    } else {
      result[roundedPrice] = {
        size: result[roundedPrice].size + size,
        total: result[roundedPrice].total + price,
        percentage: 10,
      };
    }

    return result;
  };
}

function aggregatedDataRecordToAggregatedDataRows(record: FeedAggregatedDataRecord): FeedAggregatedDataRow[] {
  return Object.entries(record).map(
    ([price, { size, total, percentage }]) => [Number(price), size, total, percentage] as FeedAggregatedDataRow,
  );
}

function aggregateFeedData(groupSize: GroupSize, { asks, bids }: FeedData): FeedAggregatedData {
  return {
    asks: aggregatedDataRecordToAggregatedDataRows(asks.reduce(toAggregatedDataRecord(groupSize), {})),
    bids: aggregatedDataRecordToAggregatedDataRows(bids.reduce(toAggregatedDataRecord(groupSize), {})),
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
            const { asks, bids } = data as FeedData;

            const groupSize = selectDataFeedGroupSize(state);
            const orderBook = {
              asks,
              bids,
            };

            return {
              ...state,
              orderBook,
              aggregatedOrderBook: aggregateFeedData(groupSize, orderBook),
            };
          }

          // Diff data message.
          case hasOrderBook && !isSnapshot: {
            const groupSize = selectDataFeedGroupSize(state);
            const previousOrderBook = selectOrderBookData(state);

            const asks = previousOrderBook.asks.filter(() => true);
            const bids = previousOrderBook.bids.filter(() => true);

            const orderBook = { asks, bids };

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
