import SingleProduct from '../../components/SingleProduct';

export const SingleProductPage = ({ query }) => (
  <SingleProduct id={query?.id} />
);

export default SingleProductPage;
