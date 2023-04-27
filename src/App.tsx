import React, { useState, useEffect } from 'react';
import { Reset } from 'styled-reset';
import './style/App.scss';
import { Routes, Route } from 'react-router-dom';
import Header from './component/Header';
import Bus from './page/Bus';
import Footer from './component/Footer';
import MenuBox from './component/MenuBox';
import Home from './page/Home';
import SpinLogo from './component/SpinLogo';

function App() {
  const [menuBox, setMenuBox] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // 너비가 768px 미만이면 모바일로 판별
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    // resize 이벤트 감지
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Reset />
      {isMobile ? (
        <>
          <Header setMenuBox={setMenuBox} />
          {menuBox && <MenuBox setMenuBox={setMenuBox} />}
          <Routes>
            <Route path='/' element={<Home setMenuBox={setMenuBox} />} />
            <Route path='/bus' element={<Bus setMenuBox={setMenuBox} />} />
            <Route path='/bus/:destination' element={<Bus setMenuBox={setMenuBox} />} />
            <Route path='*' element={<SpinLogo text1={'404 Not Found'} text2={'페이지를 찾을 수 없습니다.'} minHeight='80vh' />} />
          </Routes>
          <Footer />
        </>
      ) : (
        <div>
          <SpinLogo text1={'빵돌이는 모바일전용입니다.'} text2={'모바일로 접속해 주세요!'} />
        </div>
      )}
    </>
  );
}

export default App;
