import React, { useContext } from 'react';
import { Close as CloseIcon, Info as InfoIcon } from '@mui/icons-material';
import { CardActions, CardHeader, Button, Avatar } from '@mui/material';
import dynamic from 'next/dynamic';
import { useAuthState } from '@src/contexts/auth';
import { NotifContext } from '@src/contexts/notif';

const Loading = dynamic(() => import('@src/components/Loading'));
const AdminNotif = dynamic(() => import('./AdminNotif'));
const StockinNotif = dynamic(() => import('./StockinNotif'));
const UserNotif = dynamic(() => import('./UserNotif'));

const Notification = ({ setOpenPopper }) => {
  const { notifs, isSuccess, isLoading } = useContext(NotifContext);

  const { user } = useAuthState();
  function renderNotif(notif) {
    if (user?.role === 'KSBU') {
      if (notif.status !== 'NOTHING') {
        return <UserNotif key={notif.id} notif={notif} isSuccess={isSuccess} />;
      }
      return <AdminNotif key={notif.id} notif={notif} />;
    }
    if (user?.role === 'RT') {
      if (notif?.type === 'STOCKIN') {
        return <StockinNotif key={notif.id} notif={notif} isSuccess={isSuccess} />;
      }
      return <UserNotif key={notif.id} notif={notif} isSuccess={isSuccess} />;
    }
    return <UserNotif key={notif.id} notif={notif} isSuccess={isSuccess} />;
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {notifs?.length !== 0 ? (
            <div>{notifs?.map((notif) => renderNotif(notif))}</div>
          ) : (
            <div
              style={{
                height: '15rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    aria-label="recipe"
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #041A4D',
                    }}
                  >
                    <InfoIcon color="primary" />
                  </Avatar>
                }
                title="Tidak ada pemberitahuan"
              />
            </div>
          )}
          <CardActions
            style={{
              justifyContent: 'flex-end',
              display: 'flex',
              marginTop: '0.5rem',
            }}
          >
            <Button
              onClick={() => setOpenPopper(false)}
              size="small"
              color="secondary"
              variant="contained"
              startIcon={<CloseIcon />}
            >
              Close
            </Button>
          </CardActions>
        </div>
      )}
    </>
  );
};

export default Notification;
