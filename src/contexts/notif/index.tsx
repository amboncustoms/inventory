import React, { createContext } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

export const NotifContext = createContext(null);

export const NotifProvider = ({ children }) => {
  const {
    data: notifs,
    isSuccess,
    isError,
    isLoading,
  } = useQuery(
    'notifs',
    async () => {
      const { data } = await axios.get('/api/notifs');
      return data;
    },
    { staleTime: 3000 }
  );

  return <NotifContext.Provider value={{ notifs, isSuccess, isError, isLoading }}>{children}</NotifContext.Provider>;
};
