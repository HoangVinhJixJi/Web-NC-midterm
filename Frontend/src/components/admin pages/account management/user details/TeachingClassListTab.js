import {Container, Grid, Table, TableBody, TableContainer, TableHead, TableRow} from "@mui/material";
import SearchBar from "../../../search and filter/SearchBar";
import React, {useState} from "react";
import RenderFunctions from "../table functions/RenderFunctions";
import TeachingClassItem from "../table item/class item/TeachingClassItem";

const titleNames = ["Class Name", "Creator", "Time of Participation", "Details"];
export default function TeachingClassListTab() {
  const [classes, setClasses] = useState([
    {
      classInfo: {
        classId: "862188350134365060",
        className: "Lớp học tình thương",
        creator: {
          username: "nht2610",
          fullName: "Nguyễn Hữu Trực",
          avatar: "https://nhadepso.com/wp-content/uploads/2023/03/cap-nhat-99-hinh-anh-avatar-gau-cute-de-thuong-ngo-nghinh_1.jpg",
        },
      },
      user: {
        timeOfParticipation: "Sat Dec 23 2023 11:23:03 GMT+0700 (Indochina Time)",
      }
    }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const { renderTableColumnTitle, sortTable } = RenderFunctions();
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' hoặc 'desc'
  const [sortedBy, setSortedBy] = useState(null); // null hoặc tên column đang sắp xếp

  function handleSort(columnName) {
    if (sortedBy === columnName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOrder('asc');
    }
    setSortedBy(columnName);
  }
  function renderAccountList(classes) {
    const sortedClasses = [...classes].sort((a, b) => sortTable(a, b, sortedBy, sortOrder));
    return sortedClasses.map((_class) => (
      <TeachingClassItem _class={_class} />
    ));
  }
  function handleSearchClick() {

  }

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '55em' }}>
      <Container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 1.5 }}>
        <SearchBar
          placeholder="Search Class Name, Creator"
          searchTerm={searchTerm}
          onSearchTermChange={(e) => setSearchTerm(e.target.value)}
          onSearchClick={handleSearchClick}
        />
      </Container>
      <Grid container spacing={3} sx={{ marginTop: '20px',paddingBottom: '20px',  overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {renderTableColumnTitle(titleNames, handleSort)}
              </TableRow>
            </TableHead>
            <TableBody>
              {renderAccountList(classes)}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Container>
  );
}