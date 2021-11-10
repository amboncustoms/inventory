import React, { useContext } from 'react';
import { AccountCircle, Inbox, Notifications } from '@mui/icons-material';
import { Popper, Fade, Paper, MenuList, MenuItem, IconButton, Badge } from '@mui/material';
import Link from 'next/link';
import { CartContext } from '@src/contexts/cart';

const MenuPopper = ({
  openBottomPopper,
  handleListKeyDown,
  bottomPopperAnchorRef,
  popperHandler,
  handleProfileMenuOpen,
  notifs,
}) => {
  const { cart } = useContext(CartContext);
  return (
    <Popper
      style={{
        position: 'fixed',
        bottom: '4rem',
        right: '1.2rem',
        top: 'auto',
        left: 'auto',
      }}
      placement="top"
      open={openBottomPopper}
      anchorEl={bottomPopperAnchorRef.current}
      role={undefined}
      transition
      disablePortal
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps}>
          <Paper>
            <MenuList autoFocusItem={openBottomPopper} id="menu-list-grow" onKeyDown={handleListKeyDown}>
              <MenuItem onClick={popperHandler}>
                <IconButton aria-label="show 11 new notifications" color="inherit">
                  <Badge badgeContent={notifs && notifs.length} color="secondary">
                    <Notifications color="primary" />
                  </Badge>
                </IconButton>
              </MenuItem>
              <Link href="/cart" passHref>
                <MenuItem component="a">
                  <IconButton aria-label="show 4 new mails" color="inherit">
                    {cart.length <= 0 ? (
                      <Inbox color="primary" />
                    ) : (
                      <Badge badgeContent={cart.length} color="secondary">
                        <Inbox color="primary" />
                      </Badge>
                    )}
                  </IconButton>
                </MenuItem>
              </Link>
              <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="primary-search-account-menu"
                  aria-haspopup="true"
                  color="inherit"
                >
                  <AccountCircle color="primary" />
                </IconButton>
              </MenuItem>
            </MenuList>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};

export default MenuPopper;
