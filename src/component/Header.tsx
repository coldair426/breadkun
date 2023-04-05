import React from 'react';
import styles from '../style/Header.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

const hs = classNames.bind(styles);

function Header({ setMenuBox }: { setMenuBox: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <header className={hs('header')}>
      <Link to={'/'}>
        <img className={hs('header__logo')} src='/logo/breadkunLogoDarkMode.png' alt='breadkun-header-logo' />
      </Link>
      <button onClick={() => setMenuBox(true)}>
        <img className={hs('header__button')} src='/icon/header-menu-button.png' alt='breadkun-header-menu' />
      </button>
    </header>
  );
}

export default Header;
