import {useEffect, useState} from 'react';
import {
  Button,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';
import api from '../../../../api/api';

export default function UnbanAccountDialog(
  {
    userId, username,
    isOpenUnbanAccountDialog, onCloseUnbanAccountDialog,
    setIsSuccess
  }) {
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState("success");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisplayCloseButton, setIsDisplayCloseButton] = useState(false);
  async function handleConfirmClick() {
    try {
      setIsDisabled(true);
      const data = { userId: userId };
      const response = await api.post('/admin/management/account/unban', data);
      console.log('Banned account info: ', response.data);
      if (response.data) {
        setMessageColor("success");
        setMessage(`The account with username ${username} has been successfully unbanned`);
        setIsSuccess(true);
      } else {
        setMessageColor("eror");
        setMessage(`Account unban failed, please try again.`);
        setIsSuccess(false);
      }
      setIsDisplayCloseButton(true);
    } catch (error) {
      console.log("Banning account error: ", error);
    }
  }

  useEffect(() => {
    setMessage('');
    setIsDisabled(false);
    setIsDisplayCloseButton(false);
  }, [userId]);

  return (
    <Dialog open={isOpenUnbanAccountDialog} onClose={() => onCloseUnbanAccountDialog(userId)}>
      <DialogTitle><strong>{`Unban account ${username}?`}</strong></DialogTitle>
      <DialogContent>
        <Typography>
          By clicking the confirmation button below, you will agree to unban the account for this user.
          The unbanned account will log in and function normally again.
        </Typography>
        <Typography color={messageColor}>{message}</Typography>
      </DialogContent>
      <DialogActions>
        {!isDisplayCloseButton
          ?
          <>
            <Button onClick={() => onCloseUnbanAccountDialog(userId)} disabled={isDisabled}>
              <strong>Cancel</strong>
            </Button>
            <Button onClick={handleConfirmClick} disabled={isDisabled}>
              <strong>Confirm</strong>
            </Button>
          </>
          :
          <Button onClick={() => onCloseUnbanAccountDialog(userId)}>
            <strong>
              Close
            </strong>
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}