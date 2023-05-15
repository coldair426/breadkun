import React, { useEffect } from 'react';
import styles from '../style/Menu.module.scss';
import classNames from 'classnames/bind';
import axios from 'axios';

const ms = classNames.bind(styles);

function Menu({ setMenuBox }: { setMenuBox: React.Dispatch<React.SetStateAction<boolean>> }) {
  useEffect(() => {
    setMenuBox(false); // 메뉴 닫기(이전버튼 클릭시)
  }, [setMenuBox]);
  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 최상단으로 스크롤링
  }, []);

  return (
    <>
      <div>메뉴 페이지 입니다</div>
    </>
  );
}

export default Menu;
