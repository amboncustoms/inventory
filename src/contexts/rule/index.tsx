import React, { createContext } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

export const RuleContext = createContext(null);

export const RuleProvider = ({ children }) => {
  const {
    data: rules,
    isSuccess,
    isError,
    isLoading,
  } = useQuery(
    'rules',
    async () => {
      const { data } = await axios.get('/api/rules');
      return data;
    },
    { staleTime: 3000 }
  );

  return <RuleContext.Provider value={{ rules, isSuccess, isError, isLoading }}>{children}</RuleContext.Provider>;
};
