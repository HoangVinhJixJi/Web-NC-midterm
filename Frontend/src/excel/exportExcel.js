
import ExcelJS from 'exceljs';

export const exportToExcel = (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Grade Board');

  // Tạo header cho bảng điểm dựa trên keys của assignments
  const uniqueAssignments = Array.from(
    new Set(data.flatMap((student) => Object.keys(student.assignments)))
  );
  const headerRow = ['Student Name', ...uniqueAssignments];
  worksheet.addRow(headerRow);

  // Thêm dữ liệu học sinh và điểm vào bảng điểm
  data.forEach((student) => {
    const rowValues = [student.studentName];
    // Duyệt qua các bài tập và thêm giá trị vào hàng
    uniqueAssignments.forEach((assignmentName) => {
      const score = student.assignments[assignmentName];
      rowValues.push(score !== null ? score : ''); // Nếu điểm là null thì để trống
    });

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

export const exportToCSV = (data) => {
  const uniqueAssignments = Array.from(
    new Set(data.flatMap((student) => Object.keys(student.assignments)))
  );
  const headerRow = ['Student Name', ...uniqueAssignments];
  const csvData = [headerRow];

  // Thêm dữ liệu học sinh và điểm vào bảng điểm
  data.forEach((student) => {
    const rowValues = [student.studentName];

    // Duyệt qua các bài tập và thêm giá trị vào hàng
    uniqueAssignments.forEach((assignmentName) => {
      const score = student.assignments[assignmentName];
      rowValues.push(score !== null ? score : ''); // Nếu điểm là null thì để trống
    });

    csvData.push(rowValues);
  });
  console.log(csvData);

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
  

// export const readExcelFile = async (file) => {
//   const fileExtension = file.name.split('.').pop().toLowerCase();
//   if (fileExtension === 'xlsx') {
//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.load(file);

//     // Assume the first sheet contains the data
//     const worksheet = workbook.getWorksheet(1);

//     // Convert worksheet to JSON
//     const sheetData = [];

//     worksheet.eachRow({ includeEmpty: false }, (row) => {
//       const rowData = {};
//       row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
//         // Assume the first row contains headers
//         if (row.number === 1) {
//           rowData[cell.value] = cell.value;
//         } else {
//           rowData[worksheet.getCell(1, colNumber).value] = cell.value;
//         }
//       });
//       sheetData.push(rowData);
//     });
//     console.log(sheetData);

//     return sheetData;
//   }
//   else if (fileExtension === 'csv') {
//     const reader = new FileReader();
    
//     return new Promise((resolve, reject) => {
//       reader.onload = (event) => {
//         const csvData = event.target.result;
//         const lines = csvData.split(/\r\n|\n/);

//         // Assume the first line contains headers
//         const headers = lines[0].split(',');

//         const sheetData = lines.slice(1).map((line) => {
//           const values = line.split(',');
//           const rowData = {};
//           headers.forEach((header, index) => {
//             rowData[header] = values[index];
//           });
//           return rowData;
//         });

//         resolve(sheetData);
//       };

//       reader.onerror = (error) => {
//         reject(error.message);
//       };

//       reader.readAsText(file);
//     });
//   } else {
//     throw new Error('Unsupported file format');
//   }

// };

export const readExcelFile = async (file) => {
  const fileExtension = file.name.split('.').pop().toLowerCase();

  if (fileExtension === 'xlsx') {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file);

    // Assume the first sheet contains the data
    const worksheet = workbook.getWorksheet(1);

    // Convert worksheet to JSON
    const sheetData = [];

    worksheet.eachRow({ includeEmpty: false }, (row) => {
      const rowData = {};
      row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        // Assume the first row contains headers
        if (row.number === 1) {
          rowData[cell.value] = cell.value;
        } else {
          rowData[worksheet.getCell(1, colNumber).value] = cell.value;
        }
      });
      sheetData.push(rowData);
    });

    // Convert the sheet data to the required format
    const convertedData = sheetData.slice(1).map((row) => {
      const studentName = row['Student Name'];
      const assignments = {};

      Object.keys(row).forEach((header) => {
        if (header !== 'Student Name') {
          assignments[header] = row[header];
        }
      });

      return {
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
          const studentName = row['Student Name'];
          const assignments = {};

          Object.keys(row).forEach((header) => {
            if (header !== 'Student Name') {
              assignments[header] = row[header];
            }
          });

          return {
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
