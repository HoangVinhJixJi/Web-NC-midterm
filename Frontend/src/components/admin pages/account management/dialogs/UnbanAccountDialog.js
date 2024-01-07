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
        setMessage(`The account with username '${username}' has been successfully unbanned`);
        setIsSuccess(true);
      } else {
        setMessageColor("error");
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
      <DialogTitle><strong>{`Unban account '${username}'?`}</strong></DialogTitle>
      <DialogContent>
        <Typography>
          <div>By clicking the confirmation button below, you will agree to unban the account for this user.</div>
          <div>The unbanned account will log in and function normally again.</div>
        </Typography>
        <Typography color={messageColor}><i>{message}</i></Typography>
      </DialogContent>
      <DialogActions>
        {!isDisplayCloseButton
          ?
          <>
            <Button onClick={() => onCloseUnbanAccountDialog(userId)} disabled={isDisabled} sx={{ color: "gray" }}>
              <strong>Cancel</strong>
            </Button>
            <Button onClick={handleConfirmClick} disabled={isDisabled}>
              <strong>{isDisabled ? 'Unbanning...' : 'Unban'}</strong>
            </Button>
          </>
          :
          <Button onClick={() => onCloseUnbanAccountDialog(userId)}>
            <strong>Close</strong>
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}