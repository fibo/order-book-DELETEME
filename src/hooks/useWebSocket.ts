import { Dispatch, useCallback, useEffect, useReducer, useRef } from 'react';

import {
  DataFeedReducer,
  DataFeedState,
  DataFeedAction,
  dataFeedInitialState,
  dataFeedReducer,
  selectWebSocketIsOpen,
  selectWebSocketReadyState,
} from '../reducers/dataFeed';
import { FeedMessageSubscribe } from '../types/feed';

export type KillMessage = 'kill!';
export type WebSocketDispatch = Dispatch<DataFeedAction>;
export type WebSocketMessageSent = FeedMessageSubscribe | KillMessage;
export type WebSocketSendMessage = (message: WebSocketMessageSent) => void;

function initializeWebSocket(webSocketUrl: string, dispatch: WebSocketDispatch) {
  try {
    const webSocket = new WebSocket(webSocketUrl);

    dispatch({ type: 'WEBSOCKET_CONNECTING' });

    webSocket.onopen = () => {
      dispatch({ type: 'WEBSOCKET_OPEN' });
    };

    webSocket.onerror = (error) => {
      console.error(error);
      dispatch({ type: 'WEBSOCKET_ERROR' });
    };

    webSocket.onmessage = (event) => {
      dispatch({ type: 'WEBSOCKET_RECEIVE_MESSAGE', data: event.data });
    };

    return webSocket;
  } catch (error) {
    throw error;
  }
}

export function useWebSocket(webSocketUrl: string): [DataFeedState, WebSocketSendMessage] {
  const [state, dispatch] = useReducer<DataFeedReducer>(dataFeedReducer, dataFeedInitialState());
  const webSocketRef = useRef<WebSocket>();

  const readyState = selectWebSocketReadyState(state);
  const webSocketIsOpen = selectWebSocketIsOpen(state);

  const sendMessage = useCallback(
    (message: WebSocketMessageSent) => {
      if (webSocketIsOpen) {
        const webSocket = webSocketRef.current;

        if (webSocket) {
          webSocket.send(JSON.stringify(message));
        }
      }
    },
    [webSocketIsOpen, webSocketRef],
  );

  useEffect(() => {
    if (readyState === null) {
      try {
        const webSocket = initializeWebSocket(webSocketUrl, dispatch);
        webSocketRef.current = webSocket;
      } catch (error) {
        console.error(error);
      }
    }
  }, [readyState, webSocketUrl]);

  return [state, sendMessage];
}
