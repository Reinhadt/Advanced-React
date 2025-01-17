import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';
import ErrorMessage from '../components/ErrorMessage';
import OrderStyles from '../components/styles/OrderStyles';
import formatMoney from '../lib/formatMoney';
import OrderItemStyles from '../components/styles/OrderItemStyles';

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    allOrders {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        name
        description
        price
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

const countItemsInOrder = (order) =>
  order.items.reduce((tally, item) => tally + item.quantity, 0);

const Orders = () => {
  const { data, error, loading } = useQuery(USER_ORDERS_QUERY);
  if (loading) return <p>loading..</p>;
  if (error) return <ErrorMessage>{error.message}</ErrorMessage>;

  const { allOrders } = data;

  return (
    <div>
      <Head>
        <title>Your Orders ({allOrders.length})</title>
      </Head>
      <h2>You have {allOrders.length} orders</h2>
      <OrderUl>
        {allOrders.map((order) => {
          const itemsAmount = countItemsInOrder(order);
          return (
            <OrderItemStyles>
              <Link href={`/order/${order.id}`}>
                <div>
                  <div className="order-meta">
                    <p>
                      {itemsAmount} item{itemsAmount > 1 && `s`}
                    </p>
                    <p>
                      {order.items.length} Product
                      {order.items.length > 1 ? `s` : ''}
                    </p>
                    <p>{formatMoney(order.total)}</p>
                  </div>
                  <div className="images">
                    {order.items.map((item) => (
                      <img
                        key={`image-${item.id}`}
                        src={item?.photo?.image.publicUrlTransformed}
                        alt={item.name}
                      />
                    ))}
                  </div>
                </div>
              </Link>
            </OrderItemStyles>
          );
        })}
      </OrderUl>
    </div>
  );
};

export default Orders;
