import React, { useEffect } from 'react';
import styles from '../style/Home.module.scss';
import classNames from 'classnames/bind';

const hs = classNames.bind(styles);

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 최상단으로 스크롤링
  }, []);

  return (
    <div className={hs('home')}>
      <div className={hs('test1')}>메인페이지</div>
    </div>
  );
}

export default Home;
