import { useCallback } from 'react';

import { OrderBook } from './components/OrderBook';
import { WEBSOCKET_URL } from './environment';
import { useWebSocket } from './hooks/useWebSocket';
import { selectWebSocketIsOpen } from './reducers/webSocket';

export function App() {
  const [webSocketState, sendMessage] = useWebSocket(WEBSOCKET_URL);

  const webSocketIsOpen = selectWebSocketIsOpen(webSocketState);

  const onClick = useCallback(() => {
    sendMessage('{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}');
  }, [sendMessage]);

  return (
    <div>
      <OrderBook />
      <button disabled={!webSocketIsOpen} onClick={onClick}>
        Send
      </button>
    </div>
  );
}
