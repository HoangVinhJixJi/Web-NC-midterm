import {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@mui/material';
import api from '../../../../api/api';

export default function ArchiveClassDialog(
  {
    classId, className,
    isOpenArchiveClassDialog, onCloseArchiveClassDialog,
    setIsSuccess
  }) {
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState("success");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisplayCloseButton, setIsDisplayCloseButton] = useState(false);

  async function handleConfirmClick() {
    try {
      setIsDisabled(true);
      const data = { classId: classId };
      const response = await api.post('/admin/management/class/archive', data);
      console.log('Archived class info: ', response.data);
      if (response.data) {
        setMessageColor("success");
        setMessage(`The class with name '${className}' has been successfully archived`);
        setIsSuccess(true);
      } else {
        setMessageColor("error");
        setMessage(`Class archive failed, please try again.`);
        setIsSuccess(false);
      }
      setIsDisplayCloseButton(true);
    } catch (error) {
      console.log("Archiving class error: ", error);
    }
  }

  useEffect(() => {
    setMessage('');
    setIsDisabled(false);
    setIsDisplayCloseButton(false);
  }, [isOpenArchiveClassDialog]);

  return (
    <Dialog open={isOpenArchiveClassDialog} onClose={() => onCloseArchiveClassDialog(classId)}>
      <DialogTitle><strong>{`Archive class '${className}'?`}</strong></DialogTitle>
      <DialogContent>
        <Typography>
          <div>Archiving a class causes it to be archived for all participants</div>
          <div>Archived classes can't be modified by teachers or students unless they are restored.</div>
          <div>This class will move to Archived classes.</div>
        </Typography>
        <Typography sx={{ color: messageColor }}><i>{message}</i></Typography>
      </DialogContent>
      <DialogActions>
        {!isDisplayCloseButton
          ?
          <>
            <Button onClick={() => onCloseArchiveClassDialog(classId)} disabled={isDisabled} sx={{ color: "gray" }}>
              <strong>Cancel</strong>
            </Button>
            <Button onClick={handleConfirmClick} disabled={isDisabled}>
              <strong>{isDisabled ? 'Archiving...' : 'Archive'}</strong>
            </Button>
          </>
          :
          <Button onClick={() => onCloseArchiveClassDialog(classId)}>
            <strong>Close</strong>
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}