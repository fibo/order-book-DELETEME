import { GroupSize } from '../types/market';

export type OrderBookSelectProps = {
  groupSize: GroupSize;
};

export function OrderBookSelect({ groupSize }: OrderBookSelectProps) {
  return (
    <select className='order-book-select'>
      <option>Group {groupSize}</option>
    </select>
  );
}
