import gql from 'graphql-tag';
import { useQuery } from '@apollo/client/react';
import styled from 'styled-components';
import DisplayError from './ErrorMessage';

const ProductStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  max-width: var(--maxWidth);
  align-items: top;
  gap: 2rem;
  img{
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      name
      price
      description
      id
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export const SingleProduct = ({ id }) => {
  const { data, loading, error } = useQuery(SINGLE_ITEM_QUERY, {
    variables: {
      id,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;
  const {
    Product: { name, description, price, photo },
  } = data;
  return (
    <ProductStyles data-testid="singleProduct">
      <img src={photo.image.publicUrlTransformed} alt={photo.altText} />
      <div className="details">
        <h2>{name}</h2>
        <p>{description}</p>
      </div>
    </ProductStyles>
  );
};

export { SINGLE_ITEM_QUERY };
export default SingleProduct;
