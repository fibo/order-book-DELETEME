import { useCallback, useState } from 'react';

import { GroupSize, GroupSizeList } from '../types/market';

export type OrderBookSelectProps = {
  groupSize: GroupSize;
  groupSizeList: GroupSizeList;
};

export function OrderBookSelect({ groupSize, groupSizeList }: OrderBookSelectProps) {
  const [hidden, setHidden] = useState(true);

  const onClick = useCallback(() => {
    setHidden((hidden) => !hidden);
  }, [setHidden]);

  return (
    <div className='order-book-select' onClick={onClick}>
      <span className='order-book-select__label'>Group {groupSize}</span>

      <select hidden={hidden}>
        {groupSizeList.map((size, i) => (
          <option key={i} selected={size === groupSize}>
            Group {size}
          </option>
        ))}
      </select>
    </div>
  );
}
