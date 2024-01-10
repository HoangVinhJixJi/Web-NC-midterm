import {useEffect, useState} from 'react';
import api from '../../../../api/api';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@mui/material';

export default function DeleteClassDialog(
  {
    classId, className,
    isOpenDeleteClassDialog, onCloseDeleteClassDialog,
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
      const response = await api.post('/admin/management/class/delete', data);
      console.log('Deleted class info: ', response.data);
      if (response.data) {
        setMessageColor("success");
        setMessage(`The class with name '${className}' has been successfully deleted`);
        setIsSuccess(true);
      } else {
        setMessageColor("error");
        setMessage(`Class delete failed, please try again.`);
        setIsSuccess(false);
      }
      setIsDisplayCloseButton(true);
    } catch (error) {
      console.log("Deleting class error: ", error);
    }
  }

  useEffect(() => {
    setMessage('');
    setIsDisabled(false);
    setIsDisplayCloseButton(false);
  }, [classId]);

  return (
    <Dialog open={isOpenDeleteClassDialog} onClose={() => onCloseDeleteClassDialog(classId)}>
      <DialogTitle><strong>{`Delete class '${className}'?`}</strong></DialogTitle>
      <DialogContent>
        <Typography>
          <div>Participants will no longer have access to any posts or comments that have been added to this class.</div>
          <div><strong>You can't undo this action.</strong></div>
        </Typography>
        <Typography color={messageColor}><i>{message}</i></Typography>
      </DialogContent>
      <DialogActions>
        {!isDisplayCloseButton
          ?
          <>
            <Button onClick={() => onCloseDeleteClassDialog(classId)} disabled={isDisabled} sx={{ color: "gray" }}>
              <strong>Cancel</strong>
            </Button>
            <Button onClick={handleConfirmClick} disabled={isDisabled}>
              <strong>{isDisabled ? 'Deleting...' : 'Delete'}</strong>
            </Button>
          </>
          :
          <Button onClick={() => onCloseDeleteClassDialog(classId)}>
            <strong>Close</strong>
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}