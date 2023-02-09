import { createContext, useContext, useState } from 'react';

const LocalStateContext = createContext();

const LocalStateProvider = LocalStateContext.Provider;

function CarStateProvider({ children }) {
  // custom provider, store data and functionality

  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function openCart() {
    setCartOpen(true);
  }

  return (
    <LocalStateProvider
      value={{ setCartOpen, cartOpen, openCart, closeCart, toggleCart }}
    >
      {children}
    </LocalStateProvider>
  );
}

// make a custom hook for access local state
function useCart() {
  // using a consumer to access local state
  const all = useContext(LocalStateContext);
  return all;
}

export { CarStateProvider, useCart };
