import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import Button from '../../components/ui/Button';
import BlobBackground from '../../components/common/BlobBackground';
import { signup } from '../../api/auth'; // ✅ API 연결

const RegisterPage: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState(''); // <- 실제 username으로 쓸 예정
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ signup 요청 시 username으로 email 전달
      await signup(email, password, nickname);
      alert('회원가입 성공!');
      navigate('/my');
    } catch (err) {
      alert('회원가입 실패 😥');
      console.error('회원가입 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate('/my');
  };

  return (
    <div className={styles.container}>
      {/* Blob Background */}
      <BlobBackground />

      {/* Register Form */}
      <div className={styles.formContainer}>
        <div className={styles.formCard}>
          {/* Gradient Title */}
          <h1 className={styles.title}>회원가입</h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>AI 반주 생성 서비스의 멤버가 되어보세요</p>

          <form onSubmit={handleRegister} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="nickname" className={styles.label}>
                닉네임
              </label>
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className={styles.input}
                placeholder="닉네임을 입력하세요"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                이메일
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="이메일을 입력하세요"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            {/* Primary CTA Button */}
            <div className={styles.primaryButtonWrapper}>
              <Button variant="primary" size="lg" type="submit" disabled={loading} className={styles.loginButton}>
                {loading ? '회원가입 중...' : '회원가입'}
              </Button>
            </div>

            {/* Secondary Buttons */}
            <div className={styles.secondaryButtons}>
              <Button onClick={goToLogin} variant="secondary" size="md" className={styles.registerButton}>
                로그인 페이지로
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
