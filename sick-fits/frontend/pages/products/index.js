import { useRouter } from 'next/dist/client/router';
import Products from '../../components/Products';
import Pagination from '../../components/Pagination';

const ProductsPage = () => {
  const { query } = useRouter();
  const page = query?.page ? parseInt(query.page) : undefined;
  console.log('page', page);
  return (
    <div>
      <Pagination page={page || 1} />
      <Products page={page || 1} />
      <Pagination page={page || 1} />
    </div>
  );
};

export default ProductsPage;
