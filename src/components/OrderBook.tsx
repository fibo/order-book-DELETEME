import { OrderBookTable } from '../components/OrderBookTable';
import { FeedData } from '../types/feed';

interface OrderBookProps {
  data: FeedData;
}

export function OrderBook({ data: { asks, bids } }: OrderBookProps) {
  return (
    <div className='order-book'>
      <div className='order-book__header'>
        <div>Order Book</div>

        <div>Group</div>
      </div>

      <div className='order-book__content'>
        <div>
          <OrderBookTable rows={asks} />
        </div>

        <div>
          <OrderBookTable rows={bids} />
        </div>
      </div>

      <div className='order-book__footer'>
        <button>Toggle Feed</button>

        <button>Kill Feed</button>
      </div>
    </div>
  );
}
