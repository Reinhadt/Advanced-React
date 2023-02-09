import { useState } from 'react';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import styled from 'styled-components';
import nProgress from 'nprogress';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import SickButton from './styles/SickButton';
import { useCart } from '../lib/carState';
import { CURRENT_USER_QUERY } from './User';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const CheckoutForm = () => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { closeCart } = useCart();
  const [checkout, { error: graphQLError }] = useMutation(
    CREATE_ORDER_MUTATION,
    { refetchQueries: [{ query: CURRENT_USER_QUERY }] }
  );
  async function handleSubmit(e) {
    // STOP FORM FROM SUBMITTING
    e.preventDefault();
    setLoading(true);
    console.log('working');
    // START TRANSITION
    nProgress.start();
    // CREATE PAYMENT METHOD VIA STRIPE (TOKEN COMES BACK HERE)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    console.log(paymentMethod);
    // HANDLE ERRORS FROM STRIPE
    if (error) {
      setError(error);
      nProgress.done();
      return; // stops checkout
    }
    // SEND TOKEN FROM STEP 3 TO KEYSTONE SERVER WITH CUSTOM MUTATION
    const order = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    });
    // CHANGE PAGE TO VIEW ORDER
    router.push({
      pathname: '/order/[id]',
      query: { id: order.data.checkout.id },
    });
    // CLOSE THE CART
    closeCart();
    // TURN THE LOADER OFF
    setLoading(false);
    nProgress.done();
  }
  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <p style={{ fontSize: 12 }}>{error.message}</p>}
      {graphQLError && <p style={{ fontSize: 12 }}>{graphQLError.message}</p>}
      <CardElement />
      <SickButton>Check Out</SickButton>
    </CheckoutFormStyles>
  );
};

function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

export default Checkout;
