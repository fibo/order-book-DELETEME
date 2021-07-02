import { OrderBookSelect } from '../components/OrderBookSelect';
import { OrderBookTable } from '../components/OrderBookTable';
import { FeedAggregatedData } from '../types/feed';

interface OrderBookProps {
  data: FeedAggregatedData;
  onClickToggleFeed?: () => void;
  onClickKillFeed?: () => void;
  webSocketIsOpen?: boolean;
}

export function OrderBook({
  data: { asks, bids },
  onClickToggleFeed,
  onClickKillFeed,
  webSocketIsOpen,
}: OrderBookProps) {
  return (
    <div className='order-book'>
      <div className='order-book__header'>
        <div>Order Book</div>

        <OrderBookSelect />
      </div>

      <div className='order-book__content'>
        <div>
          <OrderBookTable rows={asks} side='sell' />
        </div>

        <div>
          <OrderBookTable rows={bids} side='buy' />
        </div>
      </div>

      <div className='order-book__footer'>
        <button className='button button--toggle' disabled={!webSocketIsOpen} onClick={onClickToggleFeed}>
          Toggle Feed
        </button>

        <button className='button button--kill' disabled={!webSocketIsOpen} onClick={onClickKillFeed}>
          Kill Feed
        </button>
      </div>
    </div>
  );
}
