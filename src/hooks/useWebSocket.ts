import { Dispatch, useEffect, useReducer } from 'react';

import {
  WebSocketAction,
  WebSocketReducer,
  WebSocketState,
  webSocketReducer,
  webSocketInitialState,
} from '../reducers/webSocket';

export function useWebSocket(socketUrl: string): [WebSocketState, Dispatch<WebSocketAction>] {
  const [webSocketState, webSocketDispatch] = useReducer<WebSocketReducer>(webSocketReducer, webSocketInitialState());

  const { connectionStatus } = webSocketState;

  useEffect(() => {
    switch (connectionStatus) {
      case 'UNINITIALIZED': {
        webSocketDispatch({
          type: 'INITIALIZE_WEBSOCKET',
          data: {
            socketUrl,
          },
        });
        break;
      }
      default: {
        console.error('Unhandled WebSocket connectionStatus', connectionStatus);
      }
    }
  }, [connectionStatus, socketUrl]);

  return [webSocketState, webSocketDispatch];
}
