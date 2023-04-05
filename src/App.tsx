import React, { useState } from 'react';
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
  return (
    <>
      <Reset />
      <Header setMenuBox={setMenuBox} />
      {menuBox && <MenuBox setMenuBox={setMenuBox} />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/bus' element={<Bus />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
