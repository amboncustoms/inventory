import React, { useContext, useState, useEffect } from 'react';
import { AllInbox, Dashboard, FeaturedPlayList, MoreVert } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useRouter } from 'next/router';
import { CartContext } from '@src/contexts/cart';

const BottomNav = ({ handleToggle, notifs }) => {
  const router = useRouter();
  const { cart } = useContext(CartContext);
  const [value, setValue] = useState('recents');
  const [changeColor, setChangeColor] = useState(false);

  useEffect(() => {
    if (cart?.length !== 0 || (notifs && notifs?.length !== 0)) {
      setChangeColor(true);
    }
  }, [cart, notifs]);

  const handleChange = (_event, newValue) => {
    setValue(newValue);
  };
  const onLink = (href) => {
    router.push(href);
  };

  return (
    <BottomNavigation value={value} onChange={handleChange} style={{ width: '100%' }}>
      <BottomNavigationAction
        label="Dashboard"
        value="dashboard"
        icon={<Dashboard />}
        onClick={() => onLink('/dashboard')}
      />
      <BottomNavigationAction label="Gallery" value="gallery" icon={<AllInbox />} onClick={() => onLink('/')} />
      <BottomNavigationAction
        label="Stock"
        value="stock"
        icon={<FeaturedPlayList />}
        onClick={() => onLink('/stock')}
      />
      <BottomNavigationAction
        label="More"
        value="more"
        style={{ color: changeColor && '#f50057' }}
        icon={<MoreVert />}
        onClick={handleToggle}
      />
    </BottomNavigation>
  );
};

export default BottomNav;
