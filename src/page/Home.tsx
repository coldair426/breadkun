import React, { useEffect, useState } from 'react';
import styles from '../style/Home.module.scss';
import classNames from 'classnames/bind';

const hs = classNames.bind(styles);

function Home({ setMenuBox }: { setMenuBox: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [home, setHome] = useState(true); // true: 강촌, false: 을지

  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 최상단으로 스크롤링
    // 메뉴 닫기(이전버튼 클릭시)
    setMenuBox(false);
  }, [setMenuBox]);

  return (
    <div className={hs('home')}>
      <div className={hs('home__body')}>
        <div className={hs('home__title')}>
          <button className={hs(home && 'home__title-selected')} onClick={() => setHome(true)}>
            더존 강촌캠퍼스
          </button>
          <button className={hs(home || 'home__title-selected')} onClick={() => setHome(false)}>
            더존 을지타워
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
