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
    classId,
    isOpenAssignStudentIdToAllDialog, onCloseAssignStudentIdToAllDialog,
    setIsSuccess
  }) {
  const [uploadedFile, setUploadedFile] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState("success");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisplayCloseButton, setIsDisplayCloseButton] = useState(false);
  const [importedData, setImpotedData] = useState([]);

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const dataArray = XLSX.utils.sheet_to_json(sheet, {
          header: ['#', 'userId', 'classId', 'studentId'],
        });
        console.log(dataArray);
        const finalData = dataArray.map(element => {
          return {
            userId: element['userId'],
            classId: element['classId'],
            studentId: element['studentId'],
          };
        }).filter(element => element['userId'] !== 'userId');
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
      const data = {
        classId: classId,
        importedData: importedData,
      }
      console.log(data);
      const response = await api.post('/admin/management/class/assign-student-id-to-all', data);
      console.log('Assigned students info: ', response.data);
      if (response.data) {
        setMessageColor("success");
        setMessage(`All students in the imported data file have been assigned corresponding student IDs.`);
        setIsSuccess(true);
      } else {
        setMessageColor("error");
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
    setIsDisabled(false);
    setIsDisplayCloseButton(false);
  }, [classId]);

  return (
    <Dialog open={isOpenAssignStudentIdToAllDialog} onClose={() => onCloseAssignStudentIdToAllDialog()}>
      <DialogTitle><strong>{`Assign student ID for all student?`}</strong></DialogTitle>
      <DialogContent>
        <Typography>
          <div>Student ID will be the code representing the student when participating in class.</div>
          <div>Each student in a class will have a different student ID.</div>
          <div>You need to select the Excel file to import data. A data file must follow the following format:</div>
          <div>1. Each column MUST have corresponding titles</div>
          <div>2. Each file will have 4 columns corresponding to 4 parameters (serial number, userId, classId, studentId)</div>
          <ImageListItem sx={{ width: 500, height: 250 }}>
            <img src="/images/data_file_demo.png" alt="Data File Demo"/>
          </ImageListItem>
        </Typography>
        <Typography gutterBottom><strong>Upload File (.xlsx, .xls):</strong></Typography>
        <Input type="file" inputProps={{ accept: ".xlsx, .xls" }} onChange={handleFileChange} />
        <Typography color={messageColor}><i>{message}</i></Typography>
      </DialogContent>
      <DialogActions>
        {!isDisplayCloseButton
          ?
          <>
            <Button
              onClick={() => onCloseAssignStudentIdToAllDialog(importedData)}
              disabled={isDisabled} sx={{ color: "gray" }}
            >
              <strong>Cancel</strong>
            </Button>
            <Button onClick={handleConfirmClick} disabled={isDisabled}>
              <strong>{isDisabled ? 'Assigning...' : 'Assign'}</strong>
            </Button>
          </>
          :
          <Button onClick={() => onCloseAssignStudentIdToAllDialog(importedData)}>
            <strong>Close</strong>
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}