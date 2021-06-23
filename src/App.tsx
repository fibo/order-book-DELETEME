import { useCallback } from 'react';

import { OrderBook } from './components/OrderBook';
import { WEBSOCKET_URL } from './environment';
import { useWebSocket } from './hooks/useWebSocket';

export function App() {
  const [webSocketState, webSocketDispatch] = useWebSocket(WEBSOCKET_URL);

  const { connectionStatus } = webSocketState;

  const onClick = useCallback(() => {
    webSocketDispatch({
      type: 'SEND_MESSAGE',
      data: '{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}',
    });
  }, [webSocketDispatch]);

  return (
    <div>
      <OrderBook />
      <div>{connectionStatus}</div>
      <button disabled={connectionStatus !== 'OPEN'} onClick={onClick}>
        Send
      </button>
    </div>
  );
}
