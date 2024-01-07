import React, {useEffect, useState} from 'react';
import api from '../../../../api/api';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack, TextField,
  Typography
} from '@mui/material';

export default function AssignStudentIdDialog(
  {
    userId, fullName, avatar, _studentId,
    isOpenAssignStudentIdDialog, onCloseAssignStudentIdDialog,
    setIsSuccess
  }) {
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState("success");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisplayCloseButton, setIsDisplayCloseButton] = useState(false);

  function handleResetClick() {
    setStudentId('');
  }
  async function handleConfirmClick() {
    try {
      setIsDisabled(true);
      const data = { userId: userId, studentId: studentId };
      const response = await api.post('/admin/management/account/assign-student-id', data);
      console.log('Assigned user info: ', response.data);
      if (response.data) {
        console.log(response.data);
        setMessageColor("success.main");
        if (response.data.studentId) {
          setMessage(`The user with the name '${fullName}' has been successfully assigned with student ID '${studentId}'`);
        } else {
          setMessage(`The user with the name '${fullName}' has been successfully usassigned student ID`);
        }
        setIsSuccess(true);
      } else {
        setMessageColor("error.main");
        setMessage(`Assign student ID failed, please try again.`);
        setIsSuccess(false);
      }
      setIsDisplayCloseButton(true);
    } catch (error) {
      console.log("Assigning student ID error: ", error);
    }
  }

  useEffect(() => {
    setMessage('');
    setStudentId(_studentId);
    setIsDisabled(false);
    setIsDisplayCloseButton(false);
  }, [isOpenAssignStudentIdDialog]);

  return (
    <Dialog open={isOpenAssignStudentIdDialog} onClose={() => onCloseAssignStudentIdDialog(userId, studentId)}>
      <Stack display="flex" flexDirection="column" alignItems="center" spacing={1} sx={{ marginTop: 2 }}>
        <Avatar src={avatar} alt={fullName} sx={{ width: 100, height: 100 }} />
      </Stack>
      <DialogTitle><strong>{`Assign student ID for user '${fullName}'?`}</strong></DialogTitle>
      <DialogContent>
        <Typography>
          <div>Student ID will be the code representing the student when participating in class.</div>
          <div>Each student in a class will have a different student ID.</div>
        </Typography>
        <Stack display="flex" flexDirection="column" alignItems="center">
          <TextField value={studentId} onChange={e => setStudentId(e.target.value)} />
          {studentId !== '' &&
            <DialogActions><Button onClick={handleResetClick}><strong>Reset</strong></Button></DialogActions>}
        </Stack>
        <Typography sx={{ color: messageColor }}><i>{message}</i></Typography>
      </DialogContent>
      <DialogActions>
        {!isDisplayCloseButton
          ?
          <>
            <Button
              onClick={() => onCloseAssignStudentIdDialog(userId, studentId !== '' ? studentId : null)}
              disabled={isDisabled} sx={{ color: "gray" }}
            >
              <strong>Cancel</strong>
            </Button>
            <Button onClick={handleConfirmClick} disabled={isDisabled}>
              <strong>{isDisabled ? 'Assigning...' : 'Assign'}</strong>
            </Button>
          </>
          :
          <Button onClick={() => onCloseAssignStudentIdDialog(userId, studentId !== '' ? studentId : null)}>
            <strong>Close</strong>
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}