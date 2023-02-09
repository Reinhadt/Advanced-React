import styled from 'styled-components';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import { useUser } from './User';
import Supreme from './styles/Supreme';
import formatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';
import { useCart } from '../lib/carState';
import DeleteCartItem from './DeleteCartItem';
import Checkout from './Checkout';

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid var(--ligthGray);
  display: grid;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 1rem;
  }
  h3,
  p {
    margin: 0;
  }
`;

const CartItem = ({ cartItem }) => {
  if (!cartItem) return null;
  return (
    <CartItemStyles>
      <img
        width="100"
        src={cartItem.product.photo.image.publicUrlTransformed}
        alt={cartItem.product.name}
      />
      <div>
        <h3>{cartItem.product.name}</h3>
        <p>
          {formatMoney(cartItem.product.price * cartItem.quantity)}-
          <em>
            {cartItem.quantity} &times; {formatMoney(cartItem.product.price)}
          </em>
        </p>
      </div>
      <DeleteCartItem id={cartItem.id} />
    </CartItemStyles>
  );
};

const Cart = () => {
  const me = useUser();
  const { cartOpen, closeCart } = useCart();
  if (!me) return null;
  return (
    <CartStyles open={cartOpen}>
      <header>
        <Supreme>{me.name}'s cart</Supreme>
        <CloseButton type="button" onClick={closeCart}>
          &times;
        </CloseButton>
      </header>
      <ul>
        {me.cart.map((cartItem) => (
          <CartItem key={cartItem.id} cartItem={cartItem} />
        ))}
      </ul>
      <footer>
        <p>{formatMoney(calcTotalPrice(me.cart))}</p>
        <Checkout />
      </footer>
    </CartStyles>
  );
};

export default Cart;
