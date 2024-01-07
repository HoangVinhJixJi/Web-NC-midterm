import React, {useEffect, useState} from 'react';
import api from '../../../../api/api';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemAvatar, Stack, TextField,
  Typography
} from '@mui/material';

export default function AssignStudentIdDialog(
  {
    userId, fullName, avatar, classId,
    isOpenAssignStudentIdDialog, onCloseAssignStudentIdDialog,
    setIsSuccess
  }) {
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState("success");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisplayCloseButton, setIsDisplayCloseButton] = useState(false);

  async function handleConfirmClick() {
    try {
      setIsDisabled(true);
      const data = { userId: userId, classId: classId, studentId: studentId };
      const response = await api.post('/admin/management/class/assign-student-id', data);
      console.log('Assigned student info: ', response.data);
      if (response.data) {
        setMessageColor("success");
        setMessage(`The student with the name '${fullName}' has been successfully assigned with student ID '${studentId}'`);
        setIsSuccess(true);
      } else {
        setMessageColor("error");
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
    setIsDisabled(false);
    setIsDisplayCloseButton(false);
  }, [userId]);

  return (
    <Dialog open={isOpenAssignStudentIdDialog} onClose={() => onCloseAssignStudentIdDialog(userId, studentId)}>
      <Stack display="flex" flexDirection="column" alignItems="center" spacing={1} sx={{ marginTop: 2 }}>
        <Avatar src={avatar} alt={fullName} sx={{ width: 100, height: 100 }} />
      </Stack>
      <DialogTitle><strong>{`Assign student ID for student '${fullName}'?`}</strong></DialogTitle>
      <DialogContent>
        <Typography>
          <div>Student ID will be the code representing the student when participating in class.</div>
          <div>Each student in a class will have a different student ID.</div>
        </Typography>
        <Stack display="flex" flexDirection="column" alignItems="center">
          <TextField value={studentId} onChange={e => setStudentId(e.target.value)} />
        </Stack>
        <Typography color={messageColor}><i>{message}</i></Typography>
      </DialogContent>
      <DialogActions>
        {!isDisplayCloseButton
          ?
          <>
            <Button
              onClick={() => onCloseAssignStudentIdDialog(userId, studentId)}
              disabled={isDisabled} sx={{ color: "gray" }}
            >
              <strong>Cancel</strong>
            </Button>
            <Button onClick={handleConfirmClick} disabled={isDisabled}>
              <strong>{isDisabled ? 'Assigning...' : 'Assign'}</strong>
            </Button>
          </>
          :
          <Button onClick={() => onCloseAssignStudentIdDialog(userId, studentId)}>
            <strong>Close</strong>
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}