import { createContext, useContext, useEffect, useReducer } from 'react';
import Axios from 'axios';

type User = {
  userId: string;
  username: string;
  fullname: string;
  role: string;
};

type TState = {
  authenticated: boolean;
  user: User | null;
  loading: boolean;
};

const StateContext = createContext<TState>({
  authenticated: false,
  user: null,
  loading: true,
});

const DispatchContext = createContext(null);

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    case 'STOP_LOADING':
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

export const AuthProvider = ({ children }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });

  const dispatch = (type, payload = null) => {
    defaultDispatch({ type, payload });
  };

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await Axios.get('/api/auth/me');
        dispatch('LOGIN', res.data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      } finally {
        dispatch('STOP_LOADING');
      }
    }
    loadUser();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
