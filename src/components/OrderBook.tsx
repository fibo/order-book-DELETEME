import { OrderBookSelect, OrderBookSelectProps } from '../components/OrderBookSelect';
import { OrderBookTable } from '../components/OrderBookTable';
import { FeedAggregatedData } from '../types/feed';

export type OrderBookProps = Pick<OrderBookSelectProps, 'groupSize' | 'groupSizeList'> & {
  data: FeedAggregatedData;
  onClickToggleFeed?: () => void;
  onClickKillFeed?: () => void;
  webSocketIsOpen?: boolean;
};

export function OrderBook({
  data: { asks, bids },
  groupSize,
  groupSizeList,
  onClickToggleFeed,
  onClickKillFeed,
  webSocketIsOpen,
}: OrderBookProps) {
  return (
    <div className='order-book'>
      <div className='order-book__header'>
        <div>Order Book</div>

        <OrderBookSelect groupSize={groupSize} groupSizeList={groupSizeList} />
      </div>

      <div className='order-book__content'>
        <OrderBookTable rows={asks} side='sell' />

        <OrderBookTable rows={bids} side='buy' />
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
