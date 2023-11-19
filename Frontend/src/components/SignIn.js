// SignIn.js
import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {useAuth as useAuthContext} from '../api/AuthContext';
function SignIn () {
  const { isLoggedIn, user, login } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Thông báo thành công hoặc lỗi
  const navigate = useNavigate();
  const avatarURL = 'https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg';

  const handleSignIn = async (event) => {
    try {
      console.error("==> object isLoggedIn, user: " , isLoggedIn, user);
      event.preventDefault(); 
      console.log("handle Sign in");
      console.log("username: ", username);
      console.log("password: ", password);

      // Gọi API đăng ký từ phía backend
      const response = await axios.post('http://localhost:5000/auth/login', 
      {
        username: username,
        password: password,
      }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000', // Replace with your frontend origin
        }
      });
      // Xử lý phản hồi từ API
      if (response.data) {
        console.log("response.data: " ,response.data);
        const { userData, access_token } = response.data; //user gồm "id, name, avatar" dùng để hiển thị
        // Lưu thông tin người dùng và token vào localStorage
        const fakeUser = {
          name: "Nguyễn Hoàng Vinh",
          avatar: avatarURL
        }
        login(access_token, userData);
       
        // Chuyển hướng sang trang home
        navigate('/home')
      }
      

    } catch (error) {
      
      setMessage('Đăng ký thất bại. Vui lòng thử lại.');
      console.error('Đăng nhập thất bại:', error);
    }
  }

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form>
      <div className="form-group">
          <label>Username</label>
          <input type="text" onChange={(e)=>setUsername(e.target.value)} required/>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password"  onChange={(e)=>setPassword(e.target.value)} required/>
        </div>
        <button onClick={(e)=>handleSignIn(e)}>Sign In</button>
      </form>
      <h3>{message}</h3>
    </div>
  );
};

export default SignIn;
