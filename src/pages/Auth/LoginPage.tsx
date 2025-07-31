import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import Button from '../../components/ui/Button';
import BlobBackground from '../../components/common/BlobBackground';
import { login } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAccessToken, login: setUser } = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(email, password);
      const { access, refresh } = res;

      // ✅ accessToken 저장 (context + localStorage)
      setAccessToken(access);
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // ✅ user 정보 저장 (API 응답이 username, id 등 포함해야 함)
      // 예시로 임시 유저 정보 설정
      setUser({ username: email, id: 1 }); // 👉 여기서 실제 사용자 정보를 넘겨주세요

      alert('로그인 성공!');
      navigate('/');
    } catch (err) {
      console.error('로그인 실패:', err);
      alert('로그인 실패 😥');
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className={styles.container}>
      {/* Blob Background */}
      <BlobBackground />

      {/* Login Form */}
      <div className={styles.formContainer}>
        <div className={styles.formCard}>
          {/* Gradient Title */}
          <h1 className={styles.title}>로그인</h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>AI 반주 생성 서비스에 오신 것을 환영합니다</p>

          <form onSubmit={handleLogin} className={styles.form}>
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
                {loading ? '로그인 중...' : '로그인'}
              </Button>
            </div>

            {/* Secondary Buttons */}
            <div className={styles.secondaryButtons}>
              <Button onClick={goToRegister} variant="secondary" size="md" className={styles.registerButton}>
                회원가입
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
