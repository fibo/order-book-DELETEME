import { ReducerAction } from '../types/reducers';

type ActionType = 'INITIALIZE_WEBSOCKET' | 'SEND_MESSAGE';

type ConnectionStatus = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED' | 'UNITIALIZED';

type WebSocketState = {
  connectionStatus: ConnectionStatus;
};

export const webSocketInitialState = (): WebSocketState => ({ connectionStatus: 'UNITIALIZED' });

export function webSocketReducer(state: WebSocketState, action: ReducerAction<ActionType>) {
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
