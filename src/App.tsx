import { useCallback, useEffect } from 'react';

import { OrderBook } from './components/OrderBook';
import { WEBSOCKET_URL } from './environment';
import { useWebSocket } from './hooks/useWebSocket';
import {
  selectDataFeedIsConnected,
  selectDataFeedGroupSize,
  selectDataFeedGroupSizeList,
  selectWebSocketIsOpen,
  selectOrderBookAggregatedData,
  selectProductId,
} from './reducers/dataFeed';

export function App() {
  const [state, sendMessage] = useWebSocket(WEBSOCKET_URL);

  const groupSize = selectDataFeedGroupSize(state);
  const groupSizeList = selectDataFeedGroupSizeList(state);
  const webSocketIsOpen = selectWebSocketIsOpen(state);
  const orderBookData = selectOrderBookAggregatedData(state);
  const feedIsConnected = selectDataFeedIsConnected(state);
  const productId = selectProductId(state);

  const toggleFeed = useCallback(() => {
    if (webSocketIsOpen) {
      const wantedProductId = productId === 'PI_XBTUSD' ? 'PI_ETHUSD' : 'PI_XBTUSD';

      sendMessage({ event: 'subscribe', feed: 'book_ui_1', product_ids: [wantedProductId] });
    }
  }, [sendMessage, productId, webSocketIsOpen]);

  const killFeed = useCallback(() => {
    if (webSocketIsOpen) {
      sendMessage('kill!');
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
        groupSizeList={groupSizeList}
        onClickToggleFeed={toggleFeed}
        onClickKillFeed={killFeed}
        webSocketIsOpen={webSocketIsOpen}
      />
    </div>
  );
}
