import { render, screen } from '@testing-library/react';

import { OrderBook } from './OrderBook';

test('OrderBook', () => {
  render(<OrderBook data={{ asks: [], bids: [] }} />);

  const title = screen.getByText(/order book/i);
  expect(title).toBeInTheDocument();
});
