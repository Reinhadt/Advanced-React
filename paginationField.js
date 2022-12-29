import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will be in charge of everything
    read(existing = [], { args, cache }) {
      // first is ask the read fn for items
      const { skip, first } = args;

      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      const items = existing.slice(skip, skip + first).filter((item) => item);
      // if there are items and
      // there are not enough items to satisfy how many where requested
      // and we are on the last page
      // just send it
      // this is done for the last page, where we do not have same amount of items to fetch (1, for example)
      // and we are asking for more than them (2 in this case)
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // we dont have items, go fetch
        return false;
      }

      // if items in the cache, return them
      if (items.length) {
        return items;
      }

      return false; // fallback to network
    },
    merge(existing, incoming, { args }) {
      const { first, skip } = args;
      // this runs back when apollo client comes back from the network with products
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      console.log('incoming', incoming);
      console.log('merged', merged);
      // we return the merged items from cached
      return merged;
    },
  };
}
