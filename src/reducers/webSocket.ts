import { FeedMessageSnapshot, FeedMessageSubscribed, FeedMessageUpdate } from '../types/feed';
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
  feed?: string;
  readyState: ReadyState | null;
};

export const webSocketInitialState = (): WebSocketState => ({ readyState: null });

/*
 * Selectors
 */

export const selectWebSocketIsOpen = (state: WebSocketState) => state.readyState === WebSocket.OPEN;

export const selectWebSocketReadyState = (state: WebSocketState) => state.readyState;

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
        const isSnapshot = hasFeedName && (data.feed as string).endsWith('_snapshot');
        const isUpdate = hasFeedName && !isSnapshot;

        switch (true) {
          case hasSubscribedEvent && hasFeedName: {
            const { feed } = data as FeedMessageSubscribed;

            return {
              ...state,
              feed,
            };
          }

          case isSnapshot: {
            return state;
          }

          case isUpdate: {
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
