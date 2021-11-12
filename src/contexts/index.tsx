import { AuthProvider } from './auth';
import { CartProvider } from './cart';
import { CategoryProvider } from './category';
import { NotifProvider } from './notif';
import { ProductProvider } from './product';
import { RevalidateProvider } from './revalidation';
import { RuleProvider } from './rule';

export default function MainContext({ children }) {
  return (
    <AuthProvider>
      <RuleProvider>
        <NotifProvider>
          <RevalidateProvider>
            <CategoryProvider>
              <ProductProvider>
                <CartProvider>{children}</CartProvider>
              </ProductProvider>
            </CategoryProvider>
          </RevalidateProvider>
        </NotifProvider>
      </RuleProvider>
    </AuthProvider>
  );
}
