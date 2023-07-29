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
import BreadkunHelmet from './component/BreadkunHelmet';

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
      <BreadkunHelmet />
      <Header setMenuBox={setMenuBox} />
      {menuBox && <MenuBox setMenuBox={setMenuBox} />}
      <Routes>
        <Route path='/' element={<Home setMenuBox={setMenuBox} />} />
        <Route path='/meal' element={<Meal setMenuBox={setMenuBox} />} />
        <Route
          path='/cafe'
          element={
            <>
              <BreadkunHelmet
                title='더존 빵돌이 | 카페 - 준비중'
                description='더존ICT 사내 카페의 메뉴와 장바구니 기능을 제공하는 서비스입니다.'
                keywords='빵돌이, 더존ICT, 더존, 사내카페, 카페, 메뉴, 장바구니'
                url='https://breadkun.com/cafe'
              />
              <SpinLogo text1={'COMMING SOON'} text2={'서비스 준비중입니다.'} minHeight='80vh' />
            </>
          }
        />
        <Route
          path='/omakase'
          element={
            <>
              <BreadkunHelmet
                title='더존 빵돌이 | 오마카세 - 준비중'
                description='회식 장소와 맛집 등을 추천하는 서비스입니다.'
                keywords='빵돌이, 더존ICT, 더존, 회식장소, 맛집, 추천'
                url='https://breadkun.com/omakase'
              />
              <SpinLogo text1={'COMMING SOON'} text2={'서비스 준비중입니다.'} minHeight='80vh' />
            </>
          }
        />
        <Route path='/bus' element={<Bus setMenuBox={setMenuBox} />} />
        <Route path='/bus/:destination' element={<Bus setMenuBox={setMenuBox} />} />
        <Route
          path='*'
          element={
            <>
              <BreadkunHelmet title='더존 빵돌이 | 404 Not Found' description='페이지를 찾을 수 없습니다.' />
              <SpinLogo text1={'404 Not Found'} text2={'페이지를 찾을 수 없습니다.'} minHeight='80vh' />
            </>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
