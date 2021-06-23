import {
  FeedData,
  FeedAggregatedData,
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

export type WebSocketReducer = Reducer<WebSocketState, WebSocketAction>;

export type WebSocketMessageReceived = Partial<FeedMessageSnapshot> &
  Partial<FeedMessageSubscribed> &
  Partial<FeedMessageUpdate>;
/*
 * State
 */

export type WebSocketState = {
  aggregatedOrderBook: FeedAggregatedData;
  feed?: string;
  orderBook: FeedData;
  readyState: ReadyState | null;
};

export const webSocketInitialState = (): WebSocketState => ({
  aggregatedOrderBook: {
    asks: [[10, 10, 10]],
    bids: [[10, 10, 10]],
  },
  orderBook: {
    asks: [[10, 10]],
    bids: [[20, 20]],
  },
  readyState: null,
});

/*
 * Selectors
 */

export const selectWebSocketIsOpen = (state: WebSocketState) => state.readyState === WebSocket.OPEN;

export const selectWebSocketReadyState = (state: WebSocketState) => state.readyState;

export const selectOrderBookAggregatedData = (state: WebSocketState) => state.aggregatedOrderBook;

export const selectOrderBookData = (state: WebSocketState) => state.orderBook;

/*
 * Reducer
 */

export function webSocketReducer(state: WebSocketState, action: ReducerAction<ActionType>): WebSocketState {
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

        const hasSubscribedEvent = data.event === 'subscribed';
        const hasFeedName = typeof data.feed === 'string' && data.feed.length > 0;
        const hasAsks = Array.isArray(data.asks);
        const hasBids = Array.isArray(data.bids);
        const hasOrderBook = hasAsks && hasBids;
        const isSnapshot = hasFeedName && (data.feed as string).endsWith('_snapshot');

        switch (true) {
          // Subsribed event.
          case hasSubscribedEvent && hasFeedName: {
            const { feed } = data as FeedMessageSubscribed;

            return {
              ...state,
              feed,
            };
          }

          // Initial snapshot.
          case isSnapshot && hasOrderBook: {
            const { asks, bids } = data as FeedMessageSubscribed;

            return {
              ...state,
              orderBook: {
                asks,
                bids,
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
