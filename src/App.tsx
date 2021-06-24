import { useCallback } from 'react';

import { OrderBook } from './components/OrderBook';
import { WEBSOCKET_URL } from './environment';
import { useWebSocket } from './hooks/useWebSocket';
import { selectWebSocketIsOpen, selectOrderBookAggregatedData } from './reducers/dataFeed';

export function App() {
  const [state, sendMessage] = useWebSocket(WEBSOCKET_URL);

  const webSocketIsOpen = selectWebSocketIsOpen(state);
  const orderBookData = selectOrderBookAggregatedData(state);

  const onClickToggleFeed = useCallback(() => {
    sendMessage({ event: 'subscribe', feed: 'book_ui_1', product_ids: ['PI_XBTUSD'] });
  }, [sendMessage]);

  const onClickKillFeed = useCallback(() => {
    sendMessage({ event: 'subscribe', feed: 'book_ui_1', product_ids: ['PI_XBTUSD'] });
  }, [sendMessage]);

  return (
    <div className='container'>
      <OrderBook
        data={orderBookData}
        onClickToggleFeed={onClickToggleFeed}
        onClickKillFeed={onClickKillFeed}
        webSocketIsOpen={webSocketIsOpen}
      />
    </div>
  );
}
