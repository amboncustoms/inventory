import { AuthProvider } from './auth';
import { CartProvider } from './cart';
import { CategoryProvider } from './category';
import { ProductProvider } from './product';
import { RevalidateProvider } from './revalidation';

export default function MainContext({ children }) {
  return (
    <AuthProvider>
      <RevalidateProvider>
        <CategoryProvider>
          <ProductProvider>
            <CartProvider>{children}</CartProvider>
          </ProductProvider>
        </CategoryProvider>
      </RevalidateProvider>
    </AuthProvider>
  );
}
