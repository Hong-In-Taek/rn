import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (credentials) => {
    // 실제 환경에서는 서버에 인증 요청을 보내야 합니다
    console.log('Login attempt:', credentials);
    
    // 간단한 인증 시뮬레이션
    if (credentials.username && credentials.password) {
      setUser({
        username: credentials.username,
        name: '관리자'
      });
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
