import React, { createContext } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

export const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const {
    data: products,
    isSuccess,
    isError,
    isLoading,
  } = useQuery(
    'products',
    async () => {
      const { data } = await axios.get('/api/products');
      return data;
    },
    { staleTime: 3000 }
  );

  return (
    <ProductContext.Provider value={{ products, isSuccess, isError, isLoading }}>{children}</ProductContext.Provider>
  );
};
