import React, { FC, useState } from 'react';
import { Warning as WarningIcon, Help as HelpIcon, Info as InfoIcon } from '@mui/icons-material';
import { Modal, Typography, Avatar, Button, Card, Divider, CardHeader, TextField } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import { useMutation, useQueryClient } from 'react-query';
import { ERule } from '@src/utils/types';

type Rule = {
  activeStep?: number;
  allowAddToCart?: string;
  user?: any;
};

interface ModalProps {
  handler?: any;
  notification?: any;
  setOpen?: any;
  open?: boolean;
  type?: string;
  text?: string;
}

const GeneralModal: FC<ModalProps> = ({ handler, notification, setOpen, open, type, text }) => {
  const [noteValue, setNoteValue] = useState('');
  const queryClient = useQueryClient();
  const handleModalClose = () => {
    setOpen(false);
  };

  const setActiveStep = async (value, theUser) => {
    const mutation = useMutation(
      (data: Rule) => {
        return axios.patch('/api/rules', data);
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('rules');
        },
      }
    );
    mutation.mutate({ activeStep: value, user: theUser });
  };

  const setAllowAddToCart = async (value, theUser) => {
    const mutation = useMutation(
      (data: Rule) => {
        return axios.patch('/api/rules', data);
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('rules');
        },
      }
    );
    mutation.mutate({ allowAddToCart: value, user: theUser });
  };

  const setRejection = async (id, note) => {
    const mutation = useMutation(
      (data: { note: string }) => {
        return axios.patch(`/api/notifs/stockout/rejection/${id}`, data);
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('rules');
        },
      }
    );
    mutation.mutate({ note });
  };

  const handleNext = () => {
    handler();
    handleModalClose();
  };

  const handleReject = async (id) => {
    setRejection(id, noteValue);
    setActiveStep(1, notification.user);
    setAllowAddToCart(ERule.ALLOW, notification.user);
    handleModalClose();
    queryClient.invalidateQueries('notifs');
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      open={open}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div>
        <Card>
          <CardHeader
            avatar={
              <Avatar
                aria-label="recipe"
                style={{
                  backgroundColor: 'white',
                  border: `1px solid ${type === 'confirm' ? '#9500ae' : '#f50057'}`,
                }}
              >
                {type === 'auth' ? (
                  <WarningIcon color="secondary" />
                ) : type === 'reject' ? (
                  <InfoIcon color="secondary" />
                ) : (
                  <HelpIcon color="primary" />
                )}
              </Avatar>
            }
            title={type === 'auth' ? 'PERHATIAN !' : type === 'reject' ? 'CATATAN' : 'KONFIRMASI'}
          />
          <Divider />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '1.5rem',
              width: '20rem',
            }}
          >
            {type === 'reject' ? (
              <TextField
                id="note-rejection"
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                label="Catatan"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
              />
            ) : (
              <Typography variant="body1" align="center">
                {text}
              </Typography>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: type === 'auth' ? 'center' : 'space-between',
                alignItems: 'center',
                padding: 0,
                marginTop: '2rem',
              }}
            >
              {type === 'auth' ? (
                <Link href="/login" passHref>
                  <Button variant="contained" color="secondary" onClick={handleModalClose}>
                    Login
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color={type === 'reject' ? 'secondary' : 'primary'}
                    onClick={type === 'reject' ? () => handleReject(notification.id) : handleNext}
                  >
                    {type === 'reject' ? 'Kirimkan' : 'Ya'}
                  </Button>
                  <Button
                    variant="contained"
                    color={type === 'reject' ? 'secondary' : 'primary'}
                    onClick={handleModalClose}
                  >
                    {type === 'reject' ? 'Batal' : 'Tidak'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </Modal>
  );
};

export default GeneralModal;
