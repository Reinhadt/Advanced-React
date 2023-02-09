import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import SingleProduct, { SINGLE_ITEM_QUERY } from '../components/SingleProduct';
import { fakeItem } from '../lib/testUtils';

const product = fakeItem();
const mocks = [
  {
    // when someone requests this query and var combo
    request: { query: SINGLE_ITEM_QUERY, variables: { id: product.id } },
    // return some data
    result: {
      data: {
        Product: product,
      },
    },
  },
];

describe('<SingleProduct />', () => {
  it('renders the proper data', async () => {
    // we need to get some fake data
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <SingleProduct id={product.id} />
      </MockedProvider>
    );
    // wait for the est id to show up
    await screen.findByTestId('singleProduct'); // findby is async, getby is sync
    expect(container).toMatchSnapshot();
  });

  it('errors out when item is not found', async () => {
    const errorMock = [
      {
        // when someone requests this query and var combo
        request: { query: SINGLE_ITEM_QUERY, variables: { id: product.id } },
        // return some data
        result: {
          errors: [{ message: 'Item not found' }],
        },
      },
    ];

    const { container, debug } = render(
      <MockedProvider mocks={errorMock}>
        <SingleProduct id={product.id} />
      </MockedProvider>
    );
    await screen.findByTestId('graphql-error');
    expect(container).toHaveTextContent('Shoot!');
    expect(container).toHaveTextContent('Item not found');
  });
});
