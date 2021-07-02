import classnames from 'classnames';

import { FeedAggregatedDataRow } from '../types/feed';
import { MarketSide } from '../types/market';

export type OrderBookTableProps = {
  rows: FeedAggregatedDataRow[];
  side: MarketSide;
};

export function OrderBookTable({ rows, side }: OrderBookTableProps) {
  const sideIsBuy = side === 'buy';
  const sideIsSell = side === 'sell';

  return (
    <div className='order-book-table'>
      <div
        className={classnames('order-book-table__header', {
          'order-book-table__header--buy': sideIsBuy,
          'order-book-table__header--sell': sideIsSell,
        })}
      >
        {['price', 'size', 'total'].map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>

      <div>
        {rows.map(([price, size, total, percentage], i) => (
          <div
            className={classnames('order-book-table__row', {
              'order-book-table__row--buy': sideIsBuy,
              'order-book-table__row--sell': sideIsSell,
            })}
            key={i}
          >
            <div
              className={classnames('order-book-table__meter', {
                'order-book-table__meter--buy': sideIsBuy,
                'order-book-table__meter--sell': sideIsSell,
              })}
              style={{ width: `${percentage}%` }}
            />

            <span
              className={classnames('order-book-table__cell', {
                'order-book-table__cell--buy': sideIsBuy,
                'order-book-table__cell--sell': sideIsSell,
              })}
            >
              {price}
            </span>
            <span>{size}</span>
            <span>{total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
