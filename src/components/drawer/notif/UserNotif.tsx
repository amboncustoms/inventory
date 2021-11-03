import React, { useEffect, useState } from 'react';
import { Delete as DeleteIcon, CheckCircle, NotificationImportant } from '@mui/icons-material';
import {
  Card,
  CardHeader,
  Avatar,
  CardActions,
  IconButton,
  Button,
  Divider,
  Dialog,
  DialogContent,
} from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import { useMutation, useQueryClient } from 'react-query';
import Loading from '@src/components/Loading';
import { useAuthState } from '@src/contexts/auth';
import NotifDetail from './NotifDetail';

const UserNotif = ({ notif, isSuccess }) => {
  const { user } = useAuthState();
  const { status, id: notifId, userId, user: notifUser } = notif;
  const [loading, setLoading] = useState(true);
  const [incart, setIncart] = useState([]);

  const [openDetail, setOpenDetail] = useState(false);

  console.log(notif);
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
      return axios.delete(`/api/notifs/rejection${id}`);
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
                border: `1px solid ${status === 'READY' ? '#9500ae' : '#f50057'}`,
              }}
            >
              {status === 'READY' ? <CheckCircle color="primary" /> : <NotificationImportant color="secondary" />}
            </Avatar>
          }
          title={`Permohonan ${status === 'READY' ? 'Disetujui' : 'Ditolak'}`}
          subheader={user.role === 'RT' ? 'Kasubbag Umum' : notifUser?.fullname}
        />
        <CardActions style={{ justifyContent: 'flex-end', display: 'flex' }}>
          {status === 'REJECTED' && (
            <IconButton onClick={deleteNotification}>
              <DeleteIcon color="secondary" />
            </IconButton>
          )}
          <Button size="small" color={status === 'READY' ? 'primary' : 'secondary'} onClick={() => setOpenDetail(true)}>
            Detail
          </Button>
          {status !== 'REJECTED' && user.id === userId && (
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
