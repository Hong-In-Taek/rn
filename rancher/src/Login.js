import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.username && credentials.password) {
      onLogin(credentials);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="logo">
          <div className="logo-icon">S</div>
          <div className="logo-text">
            <div className="bank-name">신한 은행</div>
            <div className="platform-name">컨테이너 통합 관리 플랫폼</div>
          </div>
        </div>
      </div>
      
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="사용자 ID를 입력하세요"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 