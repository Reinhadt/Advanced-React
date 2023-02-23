import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import wait from 'waait';
import SignUp, { SIGN_UP_MUTATION } from '../components/SignUp';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser } from '../lib/testUtils';

const me = fakeUser();

const mocks = [
  // mutation mock
  {
    request: {
      query: SIGN_UP_MUTATION,
      variables: {
        email: me.email,
        name: me.name,
        password: '123portodos',
      },
    },
    result: {
      data: {
        createUser: {
          __typename: 'User',
          id: 'abc123',
          email: me.email,
          name: me.name,
        },
      },
    },
  },
  // current user mock
  // {
  //   request: { query: CURRENT_USER_QUERY },
  //   result: { data: { authenticatedItem: me } },
  // },
];

describe('<SignUp/>', () => {
  it('renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <SignUp />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it('calls the mutation properly', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <SignUp />
      </MockedProvider>
    );
    // type into the boxes
    await userEvent.type(screen.getByPlaceholderText('your name'), me.name);
    await userEvent.type(
      screen.getByPlaceholderText('your email address'),
      me.email
    );
    await userEvent.type(
      screen.getByPlaceholderText('your password'),
      '123portodos'
    );
    // click submit button
    await userEvent.click(screen.getByTestId('signupbutton'));
    await screen.findByText(`Signed up with ${me.email} Go and sign in`);
    // debug();
  });
});
