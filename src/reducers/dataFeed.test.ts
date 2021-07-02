import { dataFeedInitialState, dataFeedReducer, selectDataFeedIsConnected } from '../reducers/dataFeed';

test('WEBSOCKET_RECEIVE_MESSAGE info event', () => {
  const state = dataFeedReducer(dataFeedInitialState(), {
    type: 'WEBSOCKET_RECEIVE_MESSAGE',
    data: '{"event":"info"}',
  });

  expect(selectDataFeedIsConnected(state)).toBe(true);
});
