import React, { useState, useEffect } from 'react';
import { Reset } from 'styled-reset';
import './style/App.scss';
import { Routes, Route } from 'react-router-dom';
import Header from './component/Header';
import Bus from './page/Bus';
import Footer from './component/Footer';
import MenuBox from './component/MenuBox';
import Home from './page/Home';

function App() {
  const [menuBox, setMenuBox] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
            <Route path='/' element={<Home />} />
            <Route path='/bus' element={<Bus />} />
          </Routes>
          <Footer />
        </>
      ) : (
        <div>모바일에서만 접속 가능합니다.</div>
      )}
    </>
  );
}

export default App;
