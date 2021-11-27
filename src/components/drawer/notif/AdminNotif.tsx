import React, { useState, useEffect } from 'react';
import { NotificationsActive } from '@mui/icons-material';
import { Card, CardHeader, Avatar, CardActions, Button, Divider } from '@mui/material';
import dynamic from 'next/dynamic';

const ApprovalStockin = dynamic(() => import('@src/components/modal/ApprovalStockin'));
const ApprovalPopper = dynamic(() => import('@src/components/modal/ApprovalPopper'));
const Dialog = dynamic(() => import('@mui/material/Dialog'));
const DialogContent = dynamic(() => import('@mui/material/DialogContent'));

const AdminNotif = ({ notif }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const { user, id: notifId, description, type } = notif;
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
            <Avatar aria-label="recipe" style={{ backgroundColor: 'white', border: '1px solid #041A4D' }}>
              <NotificationsActive color="primary" />
            </Avatar>
          }
          title={description}
          subheader={user.fullname}
        />
        <CardActions style={{ justifyContent: 'flex-end', display: 'flex' }} onClick={handleClickOpen}>
          <Button size="small" color="primary">
            Detail
          </Button>
        </CardActions>
      </Card>
      <Divider />
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleClose}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogContent style={{ padding: 0 }}>
          {type === 'STOCKIN' ? (
            <ApprovalStockin userId={user.id} setOpen={setOpen} notifId={notifId} />
          ) : (
            <ApprovalPopper userId={user.id} setOpen={setOpen} notifId={notifId} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminNotif;
