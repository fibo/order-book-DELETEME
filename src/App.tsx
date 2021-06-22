import { useCallback, useEffect, useReducer } from 'react';

import { OrderBook } from './components/OrderBook';
import { webSocketReducer, webSocketInitialState } from './reducers/webSocket';

export function App() {
  const [webSocket, webSocketDispatch] = useReducer(webSocketReducer, webSocketInitialState());

  useEffect(() => {
    switch (webSocket.connectionStatus) {
      case 'UNITIALIZED': {
        webSocketDispatch({
          type: 'INITIALIZE_WEBSOCKET',
          data: {
            socketUrl: 'wss://www.cryptofacilities.com/ws/v1',
          },
        });
        break;
      }
      default: {
        console.error('Unhandled webSocket connectionStatus', webSocket.connectionStatus);
      }
    }
  }, [webSocket.connectionStatus]);

  const onClick = useCallback(() => {
    webSocketDispatch({
      type: 'SEND_MESSAGE',
      data: '{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}',
    });
  }, []);

  return (
    <div>
      <OrderBook />
      <div>{webSocket.connectionStatus}</div>
      <button disabled={webSocket.connectionStatus !== 'OPEN'} onClick={onClick}>
        Send
      </button>
    </div>
  );
}
