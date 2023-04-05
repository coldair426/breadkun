import React, { useEffect } from 'react';
import styles from '../style/MenuBox.module.scss';
import classNames from 'classnames/bind';
import { NavLink } from 'react-router-dom';

const ms = classNames.bind(styles);

function MenuBox({ menuBox, setMenuBox }: { menuBox: boolean; setMenuBox: React.Dispatch<React.SetStateAction<boolean>> }) {
  // MenuBox active 시, 부모요소 스크롤 정지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuBox]);

  return (
    <div className={ms('menu-box')}>
      <div className={ms('menu-box__mask')} />
      <div className={ms('menu-box__menus')}>
        <NavLink className={ms('menu-box__menu')} to={'/'}>
          HOME
        </NavLink>
        <NavLink className={ms('menu-box__menu')} to={'/bus'}>
          BUS
        </NavLink>
        <button className={ms('menu-box__exit')} onClick={() => setMenuBox(false)}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default MenuBox;
