import { useCallback } from 'react';

import { OrderBook } from './components/OrderBook';
import { WEBSOCKET_URL } from './environment';
import { useWebSocket } from './hooks/useWebSocket';
import { selectWebSocketIsOpen, selectOrderBookData } from './reducers/webSocket';

export function App() {
  const [state, sendMessage] = useWebSocket(WEBSOCKET_URL);

  const webSocketIsOpen = selectWebSocketIsOpen(state);
  const orderBookData = selectOrderBookData(state);

  const onClick = useCallback(() => {
    sendMessage({ event: 'subscribe', feed: 'book_ui_1', product_ids: ['PI_XBTUSD'] });
  }, [sendMessage]);

  return (
    <div>
      <OrderBook data={orderBookData} />

      <button disabled={!webSocketIsOpen} onClick={onClick}>
        Send
      </button>
    </div>
  );
}
