import React, {useEffect, useState} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, ImageListItem, Input,
  Typography
} from '@mui/material';
import api from '../../../../api/api';
import * as XLSX from 'xlsx';

export default function AssignStudentIdToAllDialog(
  {
    isOpenAssignStudentIdToAllDialog, onCloseAssignStudentIdToAllDialog,
    setIsSuccess
  }) {
  const [uploadedFile, setUploadedFile] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState("success");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabledConfirm, setIsDisabledConfirm] = useState(true);
  const [isDisplayCloseButton, setIsDisplayCloseButton] = useState(false);
  const [importedData, setImpotedData] = useState([]);
  const [responseData, setResponseData] = useState([]);

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setIsDisabledConfirm(false);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const dataArray = XLSX.utils.sheet_to_json(sheet, {
          header: ['#', 'userId', 'fullName', 'studentId'],
        });
        const finalData = dataArray.map(element => {
          return {
            userId: element['userId'],
            fullName: element['fullName'],
            studentId: element['studentId'],
          };
        }).filter(element => element['userId'] !== 'userId');
        console.log(finalData);
        setImpotedData(finalData);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please choose an Excel file.');
    }
  }
  async function handleConfirmClick() {
    try {
      setIsDisabled(true);
      setIsDisabledConfirm(true);
      const data = importedData.map(element => {
        return { userId: element.userId, studentId: element.studentId };
      });
      const response = await api.post('/admin/management/account/assign-student-ids', data);
      console.log('Assigned users info: ', response.data);
      if (response.data) {
        setResponseData(response.data);
        const duplicatedAccount = response.data.filter(account => account.studentId === null);
        console.log(duplicatedAccount);
        if (duplicatedAccount.length === 0) {
          setMessageColor("success.main");
          setMessage(`All accounts in the imported data file have been assigned successfully corresponding student IDs.`);
        } else {
          setMessageColor("error.main");
          const prompt = duplicatedAccount.length > 1
            ? `are ${duplicatedAccount.length} accounts` : 'is an account';
          const listUserIdsDuplicated = duplicatedAccount.map(account => account.userId);
          setMessage(`There ${prompt} could not be assigned studentId (${listUserIdsDuplicated}), because other accounts already exist with similar studentId.
          \nThe remaining accounts in the imported data file have assigned successfully corresponding student IDs.`);
        }
        setIsSuccess(true);
      } else {
        setMessageColor("error.main");
        setMessage(`Assign student IDs failed, please try again.`);
        setIsSuccess(false);
      }
      setIsDisplayCloseButton(true);
    } catch (error) {
      console.log("Assigning student IDs error: ", error);
    }
  }

  useEffect(() => {
    setMessage('');
    setUploadedFile('');
    setImpotedData([]);
    setIsDisabled(false);
    setIsDisabledConfirm(true);
    setIsDisplayCloseButton(false);
  }, [isOpenAssignStudentIdToAllDialog]);

  return (
    <Dialog open={isOpenAssignStudentIdToAllDialog} onClose={() => onCloseAssignStudentIdToAllDialog()}>
      <DialogTitle><strong>{`Assign student IDs?`}</strong></DialogTitle>
      <DialogContent>
        <Typography>
          <div>Student IDs will be the code representing the student when participating in class.</div>
          <div>Each student in a class will have a different student ID.</div>
          <div>You need to select the Excel file to import data. A data file must follow the following format:</div>
          <div>1. Each column MUST have corresponding titles</div>
          <div>2. Each file will have 4 columns corresponding to 4 parameters (serial number, userId, fullName, studentId)</div>
          <ImageListItem sx={{ width: 500, height: 250 }}>
            <img src="/images/data_file_demo.png" alt="Data File Demo"/>
          </ImageListItem>
        </Typography>
        <Typography gutterBottom><strong>Upload File (.xlsx, .xls, .csv):</strong></Typography>
        <Input type="file" inputProps={{ accept: ".xlsx, .xls, .csv" }} onChange={handleFileChange} />
        <Typography sx={{ color: messageColor }}><i>{message}</i></Typography>
      </DialogContent>
      <DialogActions>
        {!isDisplayCloseButton
          ?
          <>
            <Button
              onClick={() => onCloseAssignStudentIdToAllDialog(responseData)}
              disabled={isDisabled} sx={{ color: "gray" }}
            >
              <strong>Cancel</strong>
            </Button>
            <Button onClick={handleConfirmClick} disabled={isDisabledConfirm}>
              <strong>{isDisabled ? 'Assigning...' : 'Assign'}</strong>
            </Button>
          </>
          :
          <Button onClick={() => onCloseAssignStudentIdToAllDialog(responseData)}>
            <strong>Close</strong>
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}