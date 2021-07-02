import {
  dataFeedInitialState,
  dataFeedReducer,
  roundPrice,
  selectDataFeedIsConnected,
  selectOrderBookData,
} from '../reducers/dataFeed';

test('WEBSOCKET_RECEIVE_MESSAGE info event', () => {
  const state = dataFeedReducer(dataFeedInitialState(), {
    type: 'WEBSOCKET_RECEIVE_MESSAGE',
    data: '{ "event": "info" }',
  });

  expect(selectDataFeedIsConnected(state)).toBe(true);
});

test('WEBSOCKET_RECEIVE_MESSAGE diff', () => {
  const state = dataFeedReducer(
    { ...dataFeedInitialState(), orderBook: { asks: [[1000, 1]], bids: [[2000, 2]] } },
    {
      type: 'WEBSOCKET_RECEIVE_MESSAGE',
      data: '{ "asks":[ [1000, 0] ], "bids":[ [2000, 0] ] }',
    },
  );

  const orderBook = selectOrderBookData(state);
  expect(orderBook.asks.length).toBe(0);
  expect(orderBook.bids.length).toBe(0);
});

test('roundPrice', () => {
  expect(roundPrice(1, 10.2)).toBe(10);
  expect(roundPrice(0.5, 10.2)).toBe(10);
  expect(roundPrice(0.5, 10.6)).toBe(10.5);
});
