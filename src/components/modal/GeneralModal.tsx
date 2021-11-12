import React, { FC, useState } from 'react';
import { Warning as WarningIcon, Help as HelpIcon, Info as InfoIcon } from '@mui/icons-material';
import { Modal, Typography, Avatar, Button, Card, Divider, CardHeader, TextField } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import { useMutation, useQueryClient } from 'react-query';

type Rule = {
  activeStep?: number;
  allowAddToCart?: string;
  userId?: any;
};

interface ModalProps {
  handler?: any;
  notifId?: string;
  userId?: string;
  setOpen?: any;
  open?: boolean;
  type?: string;
  text?: string;
  setIncartsUpdate?: any;
  setOpenApprovalPopper?: any;
  setCartNotifUpdate?: any;
}

function deleteLocalStorage(key: string) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

const GeneralModal: FC<ModalProps> = ({
  handler,
  notifId,
  userId,
  setOpen,
  open,
  type,
  text,
  setIncartsUpdate,
  setOpenApprovalPopper,
  setCartNotifUpdate,
}) => {
  const [noteValue, setNoteValue] = useState('');
  const queryClient = useQueryClient();
  const handleModalClose = () => {
    setOpen(false);
  };
  const setActiveStepMutation = useMutation(
    (data: Rule) => {
      return axios.patch('/api/rules', data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rules');
      },
    }
  );

  const setActiveStep = async (value, theUser) => {
    setActiveStepMutation.mutate({ activeStep: value, userId: theUser });
  };

  const setAllowMutation = useMutation(
    (data: Rule) => {
      return axios.patch('/api/rules', data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rules');
      },
    }
  );

  const setAllowAddToCart = async (value, theUser) => {
    setAllowMutation.mutate({ allowAddToCart: value, userId: theUser });
  };

  const rejectMutation = useMutation(
    (data: { note: string; id: string }) => {
      return axios.patch(`/api/notifs/stockout/rejection/${data.id}`, { note: data.note });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rules');
      },
    }
  );

  const setRejection = async (id, note) => {
    rejectMutation.mutate({ note, id });
  };

  const handleNext = () => {
    handler();
    handleModalClose();
  };

  const handleReject = async (id) => {
    setRejection(id, noteValue)
      .then(() => {
        setActiveStep(1, userId);
        setAllowAddToCart('ALLOW', userId);
      })
      .catch((err) => {
        throw new Error(err);
      })
      .finally(() => {
        setIncartsUpdate([]);
        deleteLocalStorage('incarts');
        handleModalClose();
        setOpenApprovalPopper(false);
        queryClient.invalidateQueries('notifs');
        if (setCartNotifUpdate) {
          setCartNotifUpdate([]);
        }
      });
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
                  border: `1px solid ${type === 'confirm' ? '#041A4D' : '#f50057'}`,
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
          {type === 'reject' && (
            <div
              style={{
                display: 'flex',
                padding: '1rem 0 0 0 ',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" align="center">
                Silahkan mengisi alasan penolakan, dankee.
              </Typography>
            </div>
          )}
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
                    onClick={type === 'reject' ? () => handleReject(notifId) : handleNext}
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
