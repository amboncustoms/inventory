import React, { useState, useEffect, createContext } from 'react';

export const CartContext = createContext(null);

function setLocalStorage(key, value) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

// eslint-disable-next-line consistent-return
function getLocalStorage(key, initialValue) {
  try {
    if (typeof window !== 'undefined') {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : initialValue;
    }
    return initialValue;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

type Cart = {
  productId: string;
  name: string;
  category: string;
  quantity: number;
  incart: number;
};

export const CartProvider = ({ children }) => {
  const [skipped, setSkipped] = useState(new Set<number>());
  const [cart, setCart] = useState<Cart[]>(() => getLocalStorage('carts', []));
  const countProduct = () => {
    return cart.reduce((acc, value) => acc + value.incart, 0);
  };

  useEffect(() => {
    setLocalStorage('carts', cart);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        skip: [skipped, setSkipped],
        cart,
        incartTotal: countProduct(),
        setNewCart: (newCart) => setCart(newCart),
        setCartProduct: (product) =>
          setCart((prev) => {
            const { productId } = product;
            const productExist = prev.find((p) => p.productId === productId);
            if (productExist) return prev;
            return [...prev, product];
          }),
        setCartToEmpty: () => setCart([]),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
