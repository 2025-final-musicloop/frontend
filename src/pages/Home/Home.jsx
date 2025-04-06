import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    alert(`회원가입 요청: ${username}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>음악 루프 생성 사이트</div>

      <form onSubmit={handleSignup} className={styles.signupForm}>
        <h2>회원가입</h2>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">회원가입</button>
      </form>

      <div className={styles.navButtons}>
        <button onClick={() => navigate('/make')}>제작 페이지로 가기</button>
        <button onClick={() => navigate('/board')}>게시판으로 가기</button>
      </div>
    </div>
  );
}

export default Home;
