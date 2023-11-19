import React from 'react';
import { Container, Typography, Grid, Paper, Avatar } from '@mui/material';

const members = [
  {
    name: 'Nguyễn Minh Trí',
    description: 'Anh đẹp trai thứ 2 thì bất kỳ Ai cũng là số 1  !!! 😝😝😜',
    avatar: 'https://demoda.vn/wp-content/uploads/2022/03/avatar-nam-cute.jpg', // Hình ảnh thành viên 1
  },
  {
    name: 'Nguyễn Hữu Trực',
    description: 'Tài năng, tiền bạc, ngoại hình những gì bạn cần đều ở con người này đây!!! 💥💥💥',
    avatar: 'https://cdn.alongwalk.info/info/wp-content/uploads/2022/11/16190614/image-99-hinh-avatar-cute-ngau-ca-tinh-de-thuong-nhat-cho-nam-nu-88637bea6eb35f9057b02b079946426f.jpg', // Hình ảnh thành viên 2
  },
  {
    name: 'Nguyễn Hoàng Vinh',
    description: `Đây là người rất rất tốt.     Ý tui nói 2 người kế bên 👈👈👈`,
    avatar: 'https://img.hoidap247.com/picture/question/20200212/large_1581495593499.PNG', // Hình ảnh thành viên 3
  },
];

const Group = () => {
  return (
    <Container >
      <Typography variant="h4" align="center" gutterBottom mt={4}>
        Our Group
      </Typography>
      <Grid container spacing={2} >
        {members.map((member, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper style = {{  padding: '20px', textAlign: 'center' , height: '300px'}}>
              <Avatar src={member.avatar} alt={member.name} sx={{ width: 100, height: 100, margin: 'auto' }} />
              <Typography variant="h6" mt={2}>
                {member.name}
              </Typography>
              <Typography variant="body1" mt={2}>
                {member.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Group;
