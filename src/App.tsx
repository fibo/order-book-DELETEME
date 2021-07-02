import { useCallback, useEffect } from 'react';

import { OrderBook } from './components/OrderBook';
import { WEBSOCKET_URL } from './environment';
import { useWebSocket } from './hooks/useWebSocket';
import {
  selectDataFeedIsConnected,
  selectDataFeedGroupSize,
  selectWebSocketIsOpen,
  selectOrderBookAggregatedData,
} from './reducers/dataFeed';

export function App() {
  const [state, sendMessage] = useWebSocket(WEBSOCKET_URL);

  const groupSize = selectDataFeedGroupSize(state);
  const webSocketIsOpen = selectWebSocketIsOpen(state);
  const orderBookData = selectOrderBookAggregatedData(state);
  const feedIsConnected = selectDataFeedIsConnected(state);

  const toggleFeed = useCallback(() => {
    if (webSocketIsOpen) {
      sendMessage({ event: 'subscribe', feed: 'book_ui_1', product_ids: ['PI_XBTUSD'] });
    }
  }, [sendMessage, webSocketIsOpen]);

  useEffect(() => {
    if (feedIsConnected) {
      toggleFeed();
    }
  }, [feedIsConnected, toggleFeed]);

  return (
    <div className='container'>
      <OrderBook
        data={orderBookData}
        groupSize={groupSize}
        onClickToggleFeed={toggleFeed}
        onClickKillFeed={toggleFeed}
        webSocketIsOpen={webSocketIsOpen}
      />
    </div>
  );
}
