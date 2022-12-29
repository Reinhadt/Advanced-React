import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import PaginationStyles from './styles/PaginationStyles';
import DisplayError from './ErrorMessage';
import { perPage } from '../config';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    _allProductsMeta {
      count
    }
  }
`;

export const Pagination = ({ page }) => {
  const { error, loading, data } = useQuery(PAGINATION_QUERY);
  if (loading) return 'Loading...';
  if (error) return <DisplayError error={error} />;
  const pageTotal = Math.ceil(data._allProductsMeta.count / perPage);
  return (
    <PaginationStyles>
      <Head>
        <title>Sick fits page {page} of ___</title>
      </Head>
      <Link href={`/products/${page - 1}`}>
        <a aria-disabled={page <= 1}>Prev</a>
      </Link>
      <p>
        Page {page} of {pageTotal}
      </p>
      <p>{data._allProductsMeta.count} Items total</p>
      <Link href={`/products/${page + 1}`}>
        <a aria-disabled={page >= pageTotal}>Next</a>
      </Link>
    </PaginationStyles>
  );
};

export default Pagination;
