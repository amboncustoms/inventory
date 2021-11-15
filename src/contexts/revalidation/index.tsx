import React, { createContext, useState } from 'react';

export const RevalidateContext = createContext(null);

export const RevalidateProvider = ({ children }) => {
  const [revalidateProduct, setRevalidateProduct] = useState(false);
  const [revalidateStock, setRevalidateStock] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  return (
    <RevalidateContext.Provider
      value={{
        revalidateProduct,
        revalidateStock,
        setRevalidateProduct,
        setRevalidateStock,
        loginSuccess,
        setLoginSuccess,
      }}
    >
      {children}
    </RevalidateContext.Provider>
  );
};
