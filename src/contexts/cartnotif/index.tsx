import React, { useState, useEffect, createContext } from 'react';

export const CartNotifContext = createContext(null);

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

export const CartNotifProvider = ({ children }) => {
  const [cartNotifUpdate, setCartNotifUpdate] = useState(() => getLocalStorage('notif-cart', []));

  useEffect(() => {
    setLocalStorage('notif-cart', cartNotifUpdate);
  }, [cartNotifUpdate]);

  return (
    <CartNotifContext.Provider
      value={{
        cartNotifUpdate,
        setCartNotifUpdate,
        setNewCart: (newCart) => setCartNotifUpdate(newCart),
        setCartToEmpty: () => setCartNotifUpdate([]),
      }}
    >
      {children}
    </CartNotifContext.Provider>
  );
};
