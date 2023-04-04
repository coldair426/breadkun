import React from 'react';
import { Reset } from 'styled-reset';
import './style/App.scss';
import { Routes, Route } from 'react-router-dom';
import Header from './component/Header';
import Bus from './page/Bus';
import Footer from './component/Footer';

function App() {
  return (
    <>
      <Reset />
      <Header />
      <Routes>
        <Route path='/' element={<>메인입니다.</>} />
        <Route path='/bus' element={<Bus></Bus>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
