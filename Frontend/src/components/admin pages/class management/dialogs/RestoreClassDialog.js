import {useEffect, useState} from 'react';
import api from '../../../../api/api';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@mui/material';

export default function RestoreClassDialog(
  {
    classId, className,
    isOpenRestoreClassDialog, onCloseRestoreClassDialog,
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
      const response = await api.post('/admin/management/class/restore', data);
      console.log('Restored class info: ', response.data);
      if (response.data) {
        setMessageColor("success");
        setMessage(`The class with name '${className}' has been successfully restored`);
        setIsSuccess(true);
      } else {
        setMessageColor("error");
        setMessage(`Class restore failed, please try again.`);
        setIsSuccess(false);
      }
      setIsDisplayCloseButton(true);
    } catch (error) {
      console.log("Restoring class error: ", error);
    }
  }

  useEffect(() => {
    setMessage('');
    setIsDisabled(false);
    setIsDisplayCloseButton(false);
  }, [classId]);

  return (
    <Dialog open={isOpenRestoreClassDialog} onClose={() => onCloseRestoreClassDialog(classId)}>
      <DialogTitle><strong>{`Restore class '${className}'?`}</strong></DialogTitle>
      <DialogContent>
        <Typography>
          <div>Teachers and students of this class will be able to interact with this class again.</div>
          <div>The class will be shown in "List" and "Active" tabs.</div>
        </Typography>
        <Typography color={messageColor}><i>{message}</i></Typography>
      </DialogContent>
      <DialogActions>
        {!isDisplayCloseButton
          ?
          <>
            <Button onClick={() => onCloseRestoreClassDialog(classId)} disabled={isDisabled} sx={{ color: "gray" }}>
              <strong>Cancel</strong>
            </Button>
            <Button onClick={handleConfirmClick} disabled={isDisabled}>
              <strong>{isDisabled ? 'Restoring...' : 'Restore'}</strong>
            </Button>
          </>
          :
          <Button onClick={() => onCloseRestoreClassDialog(classId)}>
            <strong>Close</strong>
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}