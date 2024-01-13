import {useEffect, useState} from 'react';
import api from '../../../../api/api';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@mui/material';

export default function DeleteAccountDialog(
  {
    userId, username,
    isOpenDeleteAccountDialog, onCloseDeleteAccountDialog,
    setIsSuccess
  }
) {
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState("success");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisplayCloseButton, setIsDisplayCloseButton] = useState(false);
  async function handleConfirmClick() {
    try {
      setIsDisabled(true);
      const data = { userId: userId };
      const response = await api.post('/admin/management/account/delete', data);
      console.log('Delete account info: ', response.data);
      if (response.data) {
        setMessageColor("success.main");
        setMessage(`The account with username '${username}' has been successfully deleted`);
        setIsSuccess(true);
      } else {
        setMessageColor("error.main");
        setMessage(`Account deleted failed, please try again.`);
        setIsSuccess(false);
      }
      setIsDisplayCloseButton(true);
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 417:
            setMessageColor("error.main");
            setMessage('Error delete account!');
            break;
          default:
            setMessageColor("error.main");
            setMessage(`Account deleted failed, please try again.`);
        }
      }
      console.log("Deleting account error: ", error);
      setIsDisplayCloseButton(true);
    }
  }

  useEffect(() => {
    setMessage('');
    setIsDisabled(false);
    setIsDisplayCloseButton(false);
  }, [isOpenDeleteAccountDialog]);

  return (
    <Dialog open={isOpenDeleteAccountDialog} onClose={() => onCloseDeleteAccountDialog(userId)}>
      <DialogTitle><strong>{`Delete account '${username}'?`}</strong></DialogTitle>
      <DialogContent>
        <Typography>
          <div>All user data will be deleted from the system including: account information, created classes, participated classes and other related information.</div>
          <div><strong>You can't undo this action.</strong></div>
        </Typography>
        <Typography sx={{ color: messageColor }}><i>{message}</i></Typography>
      </DialogContent>
      <DialogActions>
        {!isDisplayCloseButton
          ?
          <>
            <Button onClick={() => onCloseDeleteAccountDialog(userId)} disabled={isDisabled} sx={{ color: "gray" }}>
              <strong>Cancel</strong>
            </Button>
            <Button onClick={handleConfirmClick} disabled={isDisabled}>
              <strong>{isDisabled ? 'Deleting...' : 'Delete'}</strong>
            </Button>
          </>
          :
          <Button onClick={() => onCloseDeleteAccountDialog(userId)}>
            <strong>Close</strong>
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}