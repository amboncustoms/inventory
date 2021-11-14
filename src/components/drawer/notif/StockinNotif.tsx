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
import { useMutation, useQueryClient } from 'react-query';
import Loading from '@src/components/Loading';
import NotifDetail from './NotifDetail';

const UserNotif = ({ notif, isSuccess }) => {
  const { status, id: notifId, user: notifUser, description } = notif;
  const [loading, setLoading] = useState(true);
  const [incart, setIncart] = useState([]);

  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    if (!notifId) {
      setLoading(true);
      return;
    }
    const setMyIncart = async () => {
      const { data } = await axios.get(`/api/notifs/${notifId}`);
      setIncart(data);
      setLoading(false);
    };
    setMyIncart();
  }, [notifId]);

  const queryClient = useQueryClient();
  const deleteNotifMutation = useMutation(
    (id) => {
      return axios.delete(`/api/notifs/stockin/rejection/${id}`);
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
          <IconButton onClick={deleteNotification}>
            <DeleteIcon color="secondary" />
          </IconButton>
          <Button
            size="small"
            color={status === 'READY' || status === 'APPROVED' ? 'primary' : 'secondary'}
            onClick={() => setOpenDetail(true)}
          >
            Detail
          </Button>
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
