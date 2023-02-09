import Link from 'next/link';
import { useCart } from '../lib/carState';
import SignOut from './SignOut';
import NavStyles from './styles/NavStyles';
import { useUser } from './User';
import CartCount from './CartCount';

export const Nav = () => {
  const user = useUser();
  const { openCart } = useCart();
  console.log(user);
  return (
    <NavStyles>
      <Link href="/products">Products</Link>
      {user && (
        <>
          <Link href="/sell">Sell</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/account">Account</Link>
          <SignOut />
          <button onClick={openCart} type="button">
            {' '}
            My Cart
            <CartCount
              count={user.cart.reduce(
                (tally, cartItem) =>
                  tally + (cartItem.product ? cartItem.quantity : 0),
                0
              )}
            />
          </button>
        </>
      )}
      {!user && <Link href="/signin">Sign In</Link>}
    </NavStyles>
  );
};

export default Nav;
