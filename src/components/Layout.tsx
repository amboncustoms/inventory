import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import CustomDrawer from '@src/components/drawer/CustomDrawer';
import { NotifProvider } from '@src/contexts/notif';
import { RuleProvider } from '@src/contexts/rule';

const Footer = dynamic(() => import('./Footer'));

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props): JSX.Element => {
  const { pathname } = useRouter();
  const authRoutes = ['/login', '/404'];
  const authRoute = authRoutes.includes(pathname);
  return authRoute ? (
    <div style={{ minHeight: '100vh' }}>
      <main style={{ marginBottom: '10rem' }}>{children}</main>
      <Footer />
    </div>
  ) : (
    <RuleProvider>
      <NotifProvider>
        <CustomDrawer>
          <main>{children}</main>
          <Footer />
        </CustomDrawer>
      </NotifProvider>
    </RuleProvider>
  );
};

export default Layout;
