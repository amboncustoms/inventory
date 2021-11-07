import React from 'react';
import { Close as CloseIcon, Info as InfoIcon } from '@mui/icons-material';
import { CardActions, CardHeader, Button, Avatar } from '@mui/material';
import axios from 'axios';
import { useQuery } from 'react-query';
import Loading from '@src/components/Loading';
import { useAuthState } from '@src/contexts/auth';
import AdminNotif from './AdminNotif';
import UserNotif from './UserNotif';

const getNotifs = async () => {
  const { data } = await axios.get('/api/notifs');
  return data;
};

const Notification = ({ setOpenPopper }) => {
  const {
    data: notifs,
    isSuccess,
    isLoading,
  } = useQuery('notifs', getNotifs, {
    staleTime: 3000,
  });

  const { user } = useAuthState();
  function renderNotif(notif) {
    if (user?.role === 'KSBU') {
      if (notif.status !== 'NOTHING') {
        return <UserNotif key={notif.id} notif={notif} isSuccess={isSuccess} />;
      }
      return <AdminNotif key={notif.id} notif={notif} />;
    }
    return <UserNotif key={notif.id} notif={notif} isSuccess={isSuccess} />;
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {notifs.length !== 0 ? (
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
                      border: '1px solid #9500ae',
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
