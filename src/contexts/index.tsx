import { AuthProvider } from './auth';
import { CartProvider } from './cart';

export default function MainContext({ children }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
