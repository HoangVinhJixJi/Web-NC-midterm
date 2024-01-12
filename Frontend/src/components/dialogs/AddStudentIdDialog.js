import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import api from '../../api/api';

export default function AddStudentIdDialog({ _studentId, isOpenDialog, onCloseDialogClick, setIsSuccess }) {
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState("success");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisplayCloseButton, setIsDisplayCloseButton] = useState(false);
  const [isDisplayReportButton, setIsDisplayReportButton] = useState(false);
  const [isDisplayFromReport, setIsDisplayFormReport] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [extraInfo, setExtraInfo] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const [reportMessageColor, setReportMessageColor] = useState("success");

  function handleResetClick() {
    setStudentId('');
  }
  function handleDisplayReportFormClick() {
    setIsDisplayFormReport(true);
    setIsDisabled(false);
    setIsDisplayCloseButton(false);
  }
  function handleBackClick() {
    setIsDisplayFormReport(false);
    setIsDisplayReportButton(isDisplayReportButton => isDisplayReportButton);
  }
  async function handleReportClick() {
    try {
      setIsDisabled(true);
      const data = { studentId: studentId, extraInfo: extraInfo };
      const response = await api.post('/reports/report-conflict-id', data);
      console.log('Report data: ', response.data);
      if (response.data) {
        console.log(response.data);
        setReportMessageColor("success.main");
        setReportMessage(`Your report has been successfully sent. Please wait for admin resolves.`);
      } else {
        setReportMessageColor("error.main");
        setReportMessage(`Your report has been fail sent. Try again!`);
      }
      setIsDisplayCloseButton(true);
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            setReportMessageColor("error.main");
            setReportMessage('Could not find any admin to send the report.');
            break;
          case 417:
            setReportMessageColor("error.main");
            setReportMessage('Send report to admin fail. Try again!');
            break;
          default:
            setReportMessageColor("error.main");
            setReportMessage('Add student ID fail. Try again!');
        }
      } else {
        setReportMessageColor("error.main");
        setReportMessage('Add student ID fail. Try again!');
      }
      setIsDisplayCloseButton(true);
      console.log("Adding student ID error: ", error);
    }
  }
  async function handleConfirmClick() {
    try {
      setIsDisabled(true);
      const data = { studentId: studentId };
      const response = await api.post('/users/add-studentId', data);
      console.log('Added user info: ', response.data);
      if (response.data) {
        console.log(response.data);
        setMessageColor("success.main");
        if (response.data.studentId) {
          setMessage(`Your account has been successfully assigned with student ID '${studentId}'`);
        } else {
          setMessage(`Your account has been usassigned student ID`);
        }
        setIsSuccess(true);
      } else {
        setMessageColor("error.main");
        setMessage(`Add student ID failed, please try again.`);
        setIsSuccess(false);
      }
      setIsDisplayCloseButton(true);
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 409:
            setIsDisplayReportButton(true);
            setMessageColor("error.main");
            setMessage('Add student ID fail. The student ID that you want to use was being used by others. ' +
              'Please enter another student ID or Report To Admin');
            break;
          default:
            setMessageColor("error.main");
            setMessage('Add student ID fail. Try again!');
        }
      } else {
        setMessageColor("error.main");
        setMessage('Add student ID fail. Try again!');
      }
      setIsDisabled(false);
      console.log("Adding student ID error: ", error);
    }
  }

  useEffect(() => {
    setMessage('');
    setReportMessage('');
    setStudentId(_studentId ?? '');
    setIsDisabled(false);
    setIsDisplayCloseButton(false);
    setIsDisplayReportButton(false);
    setIsDisplayFormReport(false);
    setExtraInfo('');
  }, [isOpenDialog]);

  return (
    <Dialog open={isOpenDialog} onClose={() => onCloseDialogClick(studentId)}>
      {isDisplayFromReport ?
        <>
          <DialogTitle><strong>Report conflict student ID to Admin</strong></DialogTitle>
          <DialogContent>
            <Typography gutterBottom><strong>Your student ID that you want to use:</strong></Typography>
            <Stack display="flex" flexDirection="column" alignItems="center">
              <TextField value={studentId} onChange={e => setStudentId(e.target.value)} label="Student ID" sx={{ minWidth: '25em' }} />
            </Stack>
            <Typography gutterBottom><strong>Extra information:</strong></Typography>
            <Stack display="flex" flexDirection="column" alignItems="center">
              <TextField value={extraInfo} onChange={e => setExtraInfo(e.target.value)} sx={{ minWidth: '25em' }} />
            </Stack>
            <Typography sx={{ color: reportMessageColor }}><i>{reportMessage}</i></Typography>
          </DialogContent>
          <DialogActions>
            {!isDisplayCloseButton
              ?
              <>
                <Button
                  onClick={handleBackClick}
                  disabled={isDisabled} sx={{ color: "gray" }}
                >
                  <strong>Back</strong>
                </Button>
                <Button onClick={handleReportClick} disabled={isDisabled}>
                  <strong>{isReporting ? 'Reporting...' : 'Report'}</strong>
                </Button>
              </>
              :
              <Button onClick={() => onCloseDialogClick(studentId !== '' ? studentId : null)}>
                <strong>Close</strong>
              </Button>
            }
          </DialogActions>
        </>
        :
        <>
          <DialogTitle><strong>{`${_studentId ? 'Change' : 'Add'} student ID`}</strong></DialogTitle>
          <DialogContent>
            <Typography>
              <div>Student ID will be the code representing the student when participating in class.</div>
              <div>Each student in a class will have a unique student ID.</div>
            </Typography>
            <Stack display="flex" flexDirection="column" alignItems="center" sx={{ marginTop: '1.5em' }}>
              <TextField value={studentId} onChange={e => setStudentId(e.target.value)} label="Student ID" sx={{ minWidth: '20em' }} />
              {studentId !== '' &&
                <DialogActions><Button onClick={handleResetClick}><strong>Reset</strong></Button></DialogActions>}
            </Stack>
            <Typography sx={{ color: messageColor }}><i>{message}</i></Typography>
            {isDisplayReportButton &&
              <Stack display="flex" flexDirection="column" alignItems="center">
                <Button onClick={handleDisplayReportFormClick}><strong>Report To Admin</strong></Button>
              </Stack>}
          </DialogContent>
          <DialogActions>
            {!isDisplayCloseButton
              ?
              <>
                <Button
                  onClick={() => onCloseDialogClick(studentId !== '' ? studentId : null)}
                  disabled={isDisabled} sx={{ color: "gray" }}
                >
                  <strong>Cancel</strong>
                </Button>
                <Button onClick={handleConfirmClick} disabled={isDisabled}>
                  <strong>
                    {!_studentId
                      ? isDisabled ? 'Adding...' : 'Add'
                      : isDisabled ? 'Changing...' : 'Change'
                    }
                  </strong>
                </Button>
              </>
              :
              <Button onClick={() => onCloseDialogClick(studentId !== '' ? studentId : null)}>
                <strong>Close</strong>
              </Button>
            }
          </DialogActions>
        </>
      }
    </Dialog>
  );
}