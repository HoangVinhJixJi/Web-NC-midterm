import {useEffect, useState} from 'react';
import api from '../../../../api/api';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@mui/material';

export default function ActiveAccountDialog(
  {
    userId, username,
    isOpenActiveAccountDialog, onCloseActiveAccountDialog,
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
      const response = await api.post('/admin/management/account/active', data);
      console.log('Active account info: ', response.data);
      if (response.data) {
        setMessageColor("success.main");
        setMessage(`The account with username '${username}' has been successfully activated`);
        setIsSuccess(true);
      } else {
        setMessageColor("error.main");
        setMessage(`Account active failed, please try again.`);
        setIsSuccess(false);
      }
      setIsDisplayCloseButton(true);
    } catch (error) {
      console.log("Activing account error: ", error);
    }
  }

  useEffect(() => {
    setMessage('');
    setIsDisabled(false);
    setIsDisplayCloseButton(false);
  }, [isOpenActiveAccountDialog]);

  return (
    <Dialog open={isOpenActiveAccountDialog} onClose={() => onCloseActiveAccountDialog(userId)}>
      <DialogTitle><strong>{`Active account '${username}'?`}</strong></DialogTitle>
      <DialogContent>
        <Typography>
          <div>By clicking the confirmation button below, you will agree to active the account for this user.</div>
          <div>The activated account can log in and function normally on the website.</div>
        </Typography>
        <Typography sx={{ color: messageColor }}><i>{message}</i></Typography>
      </DialogContent>
      <DialogActions>
        {!isDisplayCloseButton
          ?
          <>
            <Button onClick={() => onCloseActiveAccountDialog(userId)} disabled={isDisabled} sx={{ color: "gray" }}>
              <strong>Cancel</strong>
            </Button>
            <Button onClick={handleConfirmClick} disabled={isDisabled}>
              <strong>{isDisabled ? 'Activing...' : 'Active'}</strong>
            </Button>
          </>
          :
          <Button onClick={() => onCloseActiveAccountDialog(userId)}>
            <strong>Close</strong>
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}