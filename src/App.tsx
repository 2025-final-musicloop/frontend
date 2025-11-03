import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import Make from './pages/Make/Make';
import Explore from './pages/Explore/Explore';
import WritePost from './pages/WritePost/WritePost';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import Huming from './pages/Huming/Huming';
import GenreConversion from './pages/GenreConversion/GenreConversion';
import PostDetail from './pages/PostDetail/PostDetail';
import PostEdit from './pages/PostEdit/PostEdit';
import MyPage from './pages/MyPage/MyPage';

// ✅ 새 파일로 변경!
import MyPosts from './pages/MyPosts';           // index.tsx를 자동으로 찾음
import MyWorks from './pages/MyWorks';           // index.tsx를 자동으로 찾음
import Favorites from './pages/Favorites';       // index.tsx를 자동으로 찾음
import EditProfile from './pages/EditProfile';   // index.tsx를 자동으로 찾음

import Sidebar from './components/layout/Sidebar';
import { useAuth } from './hooks/useAuth';
import './App.css';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string>('home');

  // 현재 경로에 따라 활성 메뉴 설정
  React.useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveMenu('home');
    else if (path === '/humming') setActiveMenu('huming');  // huming ->humming 으로 수정
    else if (path === '/genre') setActiveMenu('genre');
    else if (path === '/explore') setActiveMenu('explore');
    else if (path === '/build') setActiveMenu('build');
    else if (path === '/my') setActiveMenu('my');
    else if (path === '/my/posts') setActiveMenu('my');        // ✅ 경로 수정
    else if (path === '/my/works') setActiveMenu('my');        // ✅ 경로 수정
    else if (path === '/my/favorites') setActiveMenu('my');    // ✅ 경로 수정
    else if (path === '/my/profile/edit') setActiveMenu('my'); // ✅ 경로 수정
    else if (path === '/write-post') setActiveMenu('explore');
    else if (path.startsWith('/posts/') && path.endsWith('/edit')) setActiveMenu('explore');
    else if (path === '/login' || path === '/register') setActiveMenu('my');
  }, [location.pathname]);

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);

    switch (menuId) {
      case 'home':
        navigate('/');
        break;
      case 'huming':
        navigate('/humming');
        break;
      case 'genre':
        navigate('/genre');
        break;
      case 'explore':
        navigate('/explore');
        break;
      case 'build':
        navigate('/build');
        break;
      case 'my':
        navigate('/my');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="flex h-screen">
      {/* 전역 사이드바 */}
      <Sidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />

      {/* 메인 콘텐츠 영역 */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/humming" element={<Huming />} /> //huming->humming 으로 수정
          <Route path="/genre" element={<GenreConversion />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/posts/:id/edit" element={<PostEdit />} />
          <Route path="/build" element={<Make />} />
          <Route path="/my" element={user ? <MyPage /> : <LoginPage />} />
          
          {/* ✅ 새 페이지 라우트 (경로와 컴포넌트명 수정) */}
          <Route path="/my/posts" element={user ? <MyPosts /> : <LoginPage />} />
          <Route path="/my/works" element={user ? <MyWorks /> : <LoginPage />} />
          <Route path="/my/favorites" element={user ? <Favorites /> : <LoginPage />} />
          <Route path="/my/profile/edit" element={user ? <EditProfile /> : <LoginPage />} />
          
          <Route path="/write-post" element={<WritePost />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
