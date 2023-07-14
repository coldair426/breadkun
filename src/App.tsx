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
import Meal from './page/Meal';

function App() {
  const [menuBox, setMenuBox] = useState(false);

  // 메뉴 창이 켜진 상태에서 너비 늘릴(너비가 768px 이상) 때 자동꺼짐
  useEffect(() => {
    const handleResize = () => {
      if (menuBox === true) {
        window.innerWidth >= 768 && setMenuBox(false);
      }
    };
    handleResize(); // 최초 1회 실행
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuBox]);

  return (
    <>
      <Reset />
      <Header setMenuBox={setMenuBox} />
      {menuBox && <MenuBox setMenuBox={setMenuBox} />}
      <Routes>
        <Route path='/' element={<Home setMenuBox={setMenuBox} />} />
        <Route path='/meal' element={<Meal setMenuBox={setMenuBox} />} />
        <Route path='/cafe' element={<SpinLogo text1={'COMMING SOON'} text2={'서비스 준비중입니다.'} minHeight='80vh' />} />
        <Route path='/omakase' element={<SpinLogo text1={'COMMING SOON'} text2={'서비스 준비중입니다.'} minHeight='80vh' />} />
        <Route path='/bus' element={<Bus setMenuBox={setMenuBox} />} />
        <Route path='/bus/:destination' element={<Bus setMenuBox={setMenuBox} />} />
        <Route path='*' element={<SpinLogo text1={'404 Not Found'} text2={'페이지를 찾을 수 없습니다.'} minHeight='80vh' />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
