import { Reducer, ReducerAction } from '../types/reducers';

type ActionType = 'INITIALIZE_WEBSOCKET' | 'SEND_MESSAGE';

type ConnectionStatus = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'UNINITIALIZED';

export type WebSocketAction = ReducerAction<ActionType>;

export type WebSocketState = {
  connectionStatus: ConnectionStatus;
};

export type WebSocketReducer = Reducer<WebSocketState, WebSocketAction>;

export const webSocketInitialState = (): WebSocketState => ({ connectionStatus: 'UNINITIALIZED' });

export function webSocketReducer(state: WebSocketState, action: ReducerAction<ActionType>): WebSocketState {
  switch (action.type) {
    case 'INITIALIZE_WEBSOCKET': {
      return state;
    }

    case 'SEND_MESSAGE': {
      return state;
    }

    default: {
      return state;
    }
  }
}
