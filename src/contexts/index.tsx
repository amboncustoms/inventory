import { AuthProvider } from './auth';

export default function MainContext({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
