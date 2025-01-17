import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import Nav from '../components/Nav';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeCartItem, fakeUser } from '../lib/testUtils';
import { CarStateProvider } from '../lib/carState';

// make some mocks for being logged out, logged in and logged in with cart items
const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: null } },
  },
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: fakeUser() } },
  },
];

const signedInMocksWithCartItems = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        authenticatedItem: fakeUser({
          cart: [fakeCartItem()],
        }),
      },
    },
  },
];

describe('<Nav />', () => {
  it('renders a minimal nav when signed out', () => {
    const { container, debug } = render(
      <CarStateProvider>
        <MockedProvider mocks={notSignedInMocks}>
          <Nav />
        </MockedProvider>
      </CarStateProvider>
    );
    expect(container).toHaveTextContent('Sign In');
    expect(container).toMatchSnapshot();
    const link = screen.getByText('Sign In');
    expect(link).toHaveAttribute('href', '/signin');
    const productsLink = screen.getByText('Products');
    expect(productsLink).toHaveAttribute('href', '/products');
  });

  it('renders a full nav when signed in', async () => {
    const { container, debug } = render(
      <CarStateProvider>
        <MockedProvider mocks={signedInMocks}>
          <Nav />
        </MockedProvider>
      </CarStateProvider>
    );
    await screen.findByText('Account');
    // debug();
    expect(container).toMatchSnapshot();
    expect(container).toHaveTextContent('SignOut');
  });

  it('renders the amount of items in the cart', async () => {
    const { container, debug } = render(
      <CarStateProvider>
        <MockedProvider mocks={signedInMocksWithCartItems}>
          <Nav />
        </MockedProvider>
      </CarStateProvider>
    );
    await screen.findByText('Account');
    // debug();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
