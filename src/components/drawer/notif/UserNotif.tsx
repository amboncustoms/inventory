import React, { useEffect, useState } from 'react';
import { Delete as DeleteIcon, CheckCircle, NotificationImportant } from '@mui/icons-material';
import { Card, CardHeader, Avatar, CardActions, IconButton, Button, Divider } from '@mui/material';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMutation, useQueryClient } from 'react-query';

const Loading = dynamic(() => import('@src/components/Loading'));
const NotifDetail = dynamic(() => import('./NotifDetail'));
const Dialog = dynamic(() => import('@mui/material/Dialog'));
const DialogContent = dynamic(() => import('@mui/material/DialogContent'));

const UserNotif = ({ notif, isSuccess }) => {
  const { status, id: notifId, userId, user: notifUser, description } = notif;
  const [loading, setLoading] = useState(true);
  const [incart, setIncart] = useState([]);

  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(true);
      return;
    }
    const setMyIncart = async () => {
      const { data } = await axios.get(`/api/incarts/${userId}`);
      setIncart(data);
      setLoading(false);
    };
    setMyIncart();
  }, [userId]);

  const queryClient = useQueryClient();
  const deleteNotifMutation = useMutation(
    (id) => {
      return axios.delete(`/api/notifs/stockout/rejection/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifs');
      },
    }
  );

  const deleteNotification = async () => {
    deleteNotifMutation.mutate(notifId);
  };

  return (
    <>
      <Card
        elevation={0}
        sx={{
          width: { xs: '17rem', md: '20rem' },
          padding: '1rem 0',
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              style={{
                backgroundColor: 'white',
                border: `1px solid ${status === 'READY' || status === 'APPROVED' ? '#041A4D' : '#f50057'}`,
              }}
            >
              {status === 'READY' || status === 'APPROVED' ? (
                <CheckCircle color="primary" />
              ) : (
                <NotificationImportant color="secondary" />
              )}
            </Avatar>
          }
          title={description}
          subheader={notifUser?.fullname}
        />
        <CardActions style={{ justifyContent: 'flex-end', display: 'flex' }}>
          {status === 'REJECTED' && (
            <IconButton onClick={deleteNotification}>
              <DeleteIcon color="secondary" />
            </IconButton>
          )}
          <Button
            size="small"
            color={status === 'READY' || status === 'APPROVED' ? 'primary' : 'secondary'}
            onClick={() => setOpenDetail(true)}
          >
            Detail
          </Button>
          {status === 'READY' && (
            <Link href="/cart" passHref>
              <Button size="small" color="primary">
                Go to cart
              </Button>
            </Link>
          )}
        </CardActions>
      </Card>
      <Divider />
      {!isSuccess || loading ? (
        <Loading />
      ) : (
        <Dialog fullWidth open={openDetail} scroll="body" maxWidth="xs">
          <DialogContent style={{ padding: 0, width: '100%' }}>
            <NotifDetail notif={notif} setOpenDetail={setOpenDetail} incart={incart} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default UserNotif;
