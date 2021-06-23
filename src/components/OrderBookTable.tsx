import { FeedDataPoint } from '../types/feed';

export type OrderBookTableProps = {
  rows: FeedDataPoint[];
};

export function OrderBookTable({ rows }: OrderBookTableProps) {
  return (
    <table className='order-book-table'>
      <thead>
        <tr>
          <th>price</th>
          <th>size</th>
          <th>total</th>
        </tr>
      </thead>

      <tbody>
        {rows.map(([price, amount], i) => (
          <tr key={i}>
            <td>{price}</td>

            <td>{amount}</td>

            <td>0</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
