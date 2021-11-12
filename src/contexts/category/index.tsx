import React, { createContext } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

export const CategoryContext = createContext(null);

export const CategoryProvider = ({ children }) => {
  const {
    data: categories,
    isSuccess,
    isError,
    isLoading,
  } = useQuery(
    'categories',
    async () => {
      const { data } = await axios.get('/api/categories');
      return data;
    },
    { staleTime: 3000 }
  );

  return (
    <CategoryContext.Provider value={{ categories, isSuccess, isError, isLoading }}>
      {children}
    </CategoryContext.Provider>
  );
};
