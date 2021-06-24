import {
  FeedData,
  FeedAggregatedData,
  FeedMessageInfoVersion,
  FeedMessageSnapshot,
  FeedMessageSubscribed,
  FeedMessageUpdate,
} from '../types/feed';
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

export type WebSocketAction = ReducerAction<ActionType>;

export type FeedReducer = Reducer<FeedState, WebSocketAction>;

export type WebSocketMessageReceived = Partial<FeedMessageInfoVersion> &
  Partial<FeedMessageSnapshot> &
  Partial<FeedMessageSubscribed> &
  Partial<FeedMessageUpdate>;

/*
 * State
 */

export type FeedState = {
  aggregatedOrderBook: FeedAggregatedData;
  feed?: string;
  connected: boolean;
  orderBook: FeedData;
  readyState: ReadyState | null;
};

export const feedInitialState = (): FeedState => ({
  connected: false,
  aggregatedOrderBook: {
    asks: [],
    bids: [],
  },
  orderBook: {
    asks: [],
    bids: [],
  },
  readyState: null,
});

/*
 * Selectors
 */

export const selectWebSocketIsOpen = (state: FeedState) => state.readyState === WebSocket.OPEN;

export const selectWebSocketReadyState = (state: FeedState) => state.readyState;

export const selectFeedIsConnected = (state: FeedState) => state.connected;

export const selectOrderBookAggregatedData = (state: FeedState) => state.aggregatedOrderBook;

export const selectOrderBookData = (state: FeedState) => state.orderBook;

/*
 * Reducer
 */

export function feedReducer(state: FeedState, action: ReducerAction<ActionType>): FeedState {
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

            return {
              ...state,
              orderBook: {
                asks,
                bids,
              },
              aggregatedOrderBook: {
                asks: asks.map((dataPoint) => [...dataPoint, 0]),
                bids: bids.map((dataPoint) => [...dataPoint, 0]),
              },
            };
          }

          // Diff data message.
          case hasOrderBook && !isSnapshot: {
            return state;
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
