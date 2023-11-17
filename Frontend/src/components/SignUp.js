// SignUp.js
import React, {useState, useEffect} from 'react';
import axios from 'axios';


function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // Thông báo thành công hoặc lỗi
  const [disableInputs, setDisableInputs] = useState(false); // Vô hiệu hóa trường nhập và nút



  const handleSignUp = async (event) => {
    try {
      // Vô hiệu hóa trường nhập và nút
      setDisableInputs(true);
      event.preventDefault(); 
      // Gọi API đăng ký từ phía backend
      const response = await axios.post('http://localhost:3001/auth/register', 
      {
        username: username,
        password: password,
        email: email,
       
      });
      // Xử lý phản hồi từ API
      if (response.data) {
        // Nếu đăng ký thành công, hiển thị thông báo thành công
        setMessage('Đăng ký thành công. Hãy đăng nhập ngay bây giờ.');
        console.log(response.data);
        
      }

    } catch (error) {
      
      setMessage('Đăng ký thất bại. Vui lòng thử lại.');
      console.error('Đăng ký thất bại:', error);
    }
  }

  useEffect(() => {
    // Khi component được tải lại, bật trường nhập và nút
    setDisableInputs(false);
  }, []);
  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form>
        <div className="form-group">
          <label>Username</label>
          <input type="text" disabled={disableInputs} onChange={(e)=>setUsername(e.target.value)} required/>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" disabled={disableInputs} onChange={(e)=>setPassword(e.target.value)} required/>
        </div>
      
        <div className="form-group">
          <label>Email</label>
          <input type="email" disabled={disableInputs} onChange={(e)=>setEmail(e.target.value)} required/>
        </div>
        
        <button disabled={disableInputs} onClick={(e)=>handleSignUp(e)}>Sign Up</button>
      </form>
      <h3>{message}</h3>
    </div>
  );
};

export default SignUp;
