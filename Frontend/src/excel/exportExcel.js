
import ExcelJS from 'exceljs';

//Hàm tạo tên file
function generateValidFileName(prefix, assignmentName, fileType) {
  // Chuyển đổi tên assignment sang chữ thường và loại bỏ dấu
  const sanitizedAssignmentName = assignmentName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Thay thế dấu cách bằng _
  const fileName = sanitizedAssignmentName.replace(/\s+/g, "_");
  // Thêm tiền tố  vào tên file
  return `${prefix}_${fileName}.${fileType}`;
}

//Xuất bảng điểm XLSX
export const exportGradeBoardToXLSX = (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Grade Board');
  const uniqueAssignments = Array.from(
    new Set(data.flatMap((student) => student.assignments.map((assignment) => assignment.name)))
  );
  const headerRow = ['Student ID', 'Student Name', ...uniqueAssignments, 'Total'];
  worksheet.addRow(headerRow);
  // Thêm dữ liệu học sinh và điểm vào bảng điểm
  data.forEach((student) => {
    const rowValues = [student.studentId, student.studentName];
    // Duyệt qua các bài tập và thêm giá trị vào hàng
    uniqueAssignments.forEach((assignmentName) => {
      const assignment = student.assignments.find((assignment) => assignment.name === assignmentName);
      const score = assignment ? assignment.score : '';
      rowValues.push(score !== null ? score : ''); // Nếu điểm là null thì để trống
    });
    rowValues.push(student.total);
    worksheet.addRow(rowValues);
  });
  // Lưu file Excel
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'grade_board.xlsx';
    link.click();
  });
};
//Xuất bảng điểm CSV
export const exportGradeBoardToCSV = (data) => {
  const uniqueAssignments = Array.from(
    new Set(data.flatMap((student) => student.assignments.map((assignment) => assignment.name)))
  );
  const headerRow = ['Student ID', 'Student Name', ...uniqueAssignments, 'Total'];
  const csvData= [headerRow];
  // Thêm dữ liệu học sinh và điểm vào bảng điểm
  data.forEach((student) => {
    const rowValues = [student.studentId, student.studentName];
    // Duyệt qua các bài tập và thêm giá trị vào hàng
    uniqueAssignments.forEach((assignmentName) => {
      const assignment = student.assignments.find((assignment) => assignment.name === assignmentName);
      const score = assignment ? assignment.score : '';
      rowValues.push(score !== null ? score : ''); // Nếu điểm là null thì để trống
    });
    rowValues.push(student.total);
    csvData.push(rowValues);
  });
  // Tạo nội dung CSV
  const csvContent = csvData.map((row) => row.join(',')).join('\n');
  console.log(csvContent);
  // Tạo file CSV với encoding UTF-8
  const blob = new Blob(['\ufeff', csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'grade_board.csv';
  link.click();
};
//Xuất điểm bài tập 
export const exportGradeAssignmentToXLSX = (data, assignmentName) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Grade Board');
  const headerRow = ['StudentID', 'Grade'];
  worksheet.addRow(headerRow);
  data.forEach((student) => {
    const rowValues = [student.studentId];
    const assignment = student.assignments.find((assignment) => assignment.name === assignmentName);
    const score = assignment ? assignment.score : '';
    rowValues.push(score !== null ? score : ''); // Nếu điểm là null thì để trống
    worksheet.addRow(rowValues);
  });
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = generateValidFileName('grade', assignmentName, 'xlsx');
    link.click();
  });
};

export const exportGradeAssignmentToCSV = (data, assignmentName) => {
  const headerRow = ['StudentID', 'Grade'];
  const csvData = [headerRow];
  data.forEach((student) => {
    const assignment = student.assignments.find((assignment) => assignment.name === assignmentName);
    const score = assignment ? assignment.score : '';
    const rowValues = [student.studentId, score !== null ? score : ''];
    csvData.push(rowValues);
  });
  const csvContent = csvData.map((row) => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = generateValidFileName('grade', assignmentName, 'csv');
  link.click();
};
//Xuất template file điểm bài tập
export const gradeAssignmentTemplateXLSX = (assignmentName) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Grade Board');
  const headerRow = ['StudentID', 'Grade'];
  worksheet.addRow(headerRow);
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = generateValidFileName('template', assignmentName, 'xlsx');
    link.click();
  });
};

export const gradeAssignmentTemplateCSV = (assignmentName) => {
  const headerRow = ['StudentID', 'Grade'];
  const csvData = [headerRow];
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = generateValidFileName('template', assignmentName, 'csv');
  link.click();
};

//Upload bảng điểm
export const uploadGradeBoard = async (file) => {
  const fileExtension = file.name.split('.').pop().toLowerCase();

  if (fileExtension === 'xlsx') {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);

    // Assume the first sheet contains the data
    const worksheet = workbook.getWorksheet(1);

    // Convert worksheet to JSON
    const sheetData = [];
    const header = [];

    worksheet.eachRow((row) => {
      const rowData = {};
      row.eachCell((cell, colNumber) => {
        // Assume the first row contains headers
        if (row.number === 1) {
          rowData[cell.value] = cell.value;
          header.push(cell.value);
        } else {
          rowData[header[colNumber - 1]] = cell.value;
        }
      });
      // Đảm bảo rằng tất cả các headers sẽ xuất hiện trong mỗi dòng dữ liệu
      header.forEach((header) => {
        rowData[header] = rowData[header] || '';
      });
      sheetData.push(rowData);
    });

    // Convert the sheet data to the required format
    const convertedData = sheetData.slice(1).map((row) => {
      const studentId = row['Student ID'];
      const studentName = row['Student Name'];
      const assignments = {};

      Object.keys(row).forEach((header) => {
        if (header !== 'Student Name' && header !== 'Student ID') {
          assignments[header] = row[header];
        }
      });

      return {
        studentId,
        studentName,
        assignments,
      };
    });

    return convertedData;
  } else if (fileExtension === 'csv') {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        const csvData = event.target.result;
        const lines = csvData.split(/\r\n|\n/);

        // Assume the first line contains headers
        const headers = lines[0].split(',');

        const sheetData = lines.slice(1).map((line) => {
          const values = line.split(',');
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index];
          });
          return rowData;
        });

        // Convert the sheet data to the required format
        const convertedData = sheetData.map((row) => {
          const studentId = row['Student ID'];
          const studentName = row['Student Name'];
          const assignments = {};

          Object.keys(row).forEach((header) => {
            if (header !== 'Student Name' && header !== 'Student ID') {
              assignments[header] = row[header];
            }
          });

          return {
            studentId,
            studentName,
            assignments,
          };
        });

        resolve(convertedData);
      };

      reader.onerror = (error) => {
        reject(error.message);
      };

      reader.readAsText(file);
    });
  } else {
    throw new Error('Unsupported file format');
  }
};
//Upload điểm bài tập
export const uploadGradeAssignment = async (file) => {
  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (fileExtension === 'xlsx') {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);
    const worksheet = workbook.getWorksheet(1);
    const sheetData = [];
    
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      const rowData = {
        studentId: row.getCell(1).value,
        grade: row.getCell(2).value || '',
      };
      sheetData.push(rowData);
    });
    const header = sheetData[0];
    if(header.studentId!== 'StudentID' && header.grade!== 'Grade'){
      throw new Error('Invalid CSV header. Expected columns: "StudentId" and "Grade".');
    }
    return sheetData.slice(1);
  } else if (fileExtension === 'csv') {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        const csvData = event.target.result;
        const lines = csvData.split(/\r\n|\n/);
        if(lines.length > 0){
          const header = lines[0].split(',');
          console.log(header);
          if (header.length === 2 && header[0] === 'StudentID' && header[1] === 'Grade') {
            const sheetData = lines.slice(1).map((line) => {
              const values = line.split(',');
              const rowData = {
                studentId: values[0],
                grade: values[1] || '',
              };
              return rowData;
            });
          resolve(sheetData);
          } else {
            reject(new Error('Invalid CSV header. Expected columns: "StudentId" and "Grade".'));
          }
        } else {
          reject(new Error('CSV file is empty.'));
        }
      };
      reader.onerror = (error) => {
        reject(error.message);
      };
      reader.readAsText(file);
    });
  } else {
    throw new Error('Unsupported file format');
  }
};

//Xuất danh sách học sinh
export const exportStudentListToXLSX = (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Student List');
  const headerRow = ['StudentId', 'FullName', 'Email'];
  worksheet.addRow(headerRow);

  // Thêm dữ liệu học sinh và điểm vào bảng điểm
  data.forEach((student) => {
    const rowValues = [student.studentId, student.fullName, student.email];
    worksheet.addRow(rowValues);
  });

  // Lưu file Excel
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'student-list.xlsx'
    link.click();
  });
};

export const exportStudentListToCSV = (data) => {
  
  const headerRow = ['StudentId', 'FullName', 'Email'];
  const csvData = [headerRow];
  // Thêm dữ liệu học sinh và điểm vào bảng điểm
  data.forEach((student) => {
    const rowValues = [student.studentId, student.fullName, student.email];
    csvData.push(rowValues);
  });
  // Tạo nội dung CSV
  const csvContent = csvData.map((row) => row.join(',')).join('\n');
  console.log(csvContent);
  // Tạo file CSV với encoding UTF-8
  const blob = new Blob(['\ufeff', csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'student-list.csv';
  link.click();
};
//Upload danh sách học sinh
export const uploadStudentList = async (file) => {
  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (fileExtension === 'xlsx') {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);
    const worksheet = workbook.getWorksheet(1);
    const sheetData = [];
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      const rowData = {
        studentId: row.getCell(1).value.toString(),
        fullName: row.getCell(2).value,
        email: row.getCell(3).value,
      };
      sheetData.push(rowData);
    });
    const header = sheetData[0];
    if(header.studentId!== 'StudentId' && header.fullName!== 'FullName' && header.email!== 'Email'){
      throw new Error('Invalid CSV header. Expected columns: "StudentId", "FullName", "Email".');
    }
    return sheetData.slice(1);
  } else if (fileExtension === 'csv') {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        const csvData = event.target.result;
        const lines = csvData.split(/\r\n|\n/);
        if(lines.length > 0){
          const header = lines[0].split(',');
            if (header[0] === 'StudentId' && header[1] === 'FullName'  && header[2] === 'Email') {
              const sheetData = lines.slice(1).map((line) => {
                const values = line.split(',');
                const rowData = {
                  studentId: values[0].toString(),
                  fullName: values[1],
                };
                return rowData;
              });
            resolve(sheetData);
          } else {
            reject(new Error('Invalid CSV header. Expected columns: "StudentID" and "FullName".'));
          }
        } else {
          reject(new Error('CSV file is empty.'));
        }
      };
      reader.onerror = (error) => {
        reject(error.message);
      };
      reader.readAsText(file);
    });
  } else {
    throw new Error('Unsupported file format');
  }
};
