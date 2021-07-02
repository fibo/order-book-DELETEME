import { render, screen } from '@testing-library/react';

import { OrderBook } from '../components/OrderBook';

test('OrderBook', () => {
  render(<OrderBook data={{ asks: [], bids: [] }} groupSize={0.5} />);

  const title = screen.getByText(/order book/i);
  expect(title).toBeInTheDocument();
});
