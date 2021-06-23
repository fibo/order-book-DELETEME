import { render, screen } from '@testing-library/react';

import { OrderBookTable } from './OrderBookTable';

test('OrderBook', () => {
  render(<OrderBookTable side='sell' rows={[]} />);

  const priceLabel = screen.getByText(/price/i);
  expect(priceLabel).toBeInTheDocument();

  const sizeLabel = screen.getByText(/size/i);
  expect(sizeLabel).toBeInTheDocument();

  const totalLabel = screen.getByText(/total/i);
  expect(totalLabel).toBeInTheDocument();
});
