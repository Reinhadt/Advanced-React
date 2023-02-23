import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';

const graphql = String.raw;
interface Arguments {
  token: string;
}

export default async function checkout(
  root: any,
  { token }: Arguments, // we take the token type string from our args interface up there
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. make sure they are signed in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Sorry!, you must be signed in to create an order');
  }
  // 1.5 query the current user
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: `
    id
    name
    email
    cart{
      id
      quantity
      product{
        name
        price
        description
        id
        photo{
          id
          image{
            id
            publicUrlTransformed
          }
        }
      }
    }
    `,
  });
  // 2. calculate total price of the order
  const cartItems = user.cart.filter((cartItem) => cartItem.product); // filter possible null products
  const amount = cartItems.reduce(function (
    tally: number,
    cartItem: CartItemCreateInput
  ) {
    return tally + cartItem.quantity * cartItem.product.price;
  },
  0);
  // 3. create charge with the stripe library
  const charge = await stripeConfig.paymentIntents
    .create({
      amount,
      currency: 'USD',
      confirm: true,
      payment_method: token,
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err);
    });
  // 4. convert the cart to orderItems
  const orderItems = cartItems.map((cartItem) => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id } },
    };
    return orderItem;
  });
  // 5. create order and return it
  const order = await context.lists.Order.createOne({
    data: {
      total: amount,
      charge: charge.id,
      items: { create: orderItems },
    },
  });
  // 6. clean up any old cart item
  const cartItemIds = user.cart.map((cartItem) => cartItem.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds,
  });

  return order;
}
