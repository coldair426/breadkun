import React from 'react';
import styles from '../style/Header.module.scss';
import classNames from 'classnames/bind';
import { NavLink, Link } from 'react-router-dom';

const hs = classNames.bind(styles);

function Header({ setMenuBox }: { setMenuBox: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <header className={hs('header')}>
      <Link to={'/'}>
        <img className={hs('header__logo')} src='/logo/breadkunLogoDarkMode.png' alt='breadkun-header-logo' />
      </Link>
      <nav className={hs('header__nav')}>
        <button className={hs('header__nav--button')} onClick={() => setMenuBox(true)}>
          <img className={hs('header__nav--button--img')} src='/icon/header-menu-button.png' alt='breadkun-header-menu' />
        </button>
        <div className={hs('header__nav--menus')}>
          <NavLink className={({ isActive }) => (isActive ? hs('header__nav--menu', 'active') : hs('header__nav--menu'))} to={'/'} onClick={() => setMenuBox(false)}>
            HOME
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? hs('header__nav--menu', 'active') : hs('header__nav--menu'))} to={'/meal'} onClick={() => setMenuBox(false)}>
            MEAL
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? hs('header__nav--menu', 'active') : hs('header__nav--menu'))} to={'/bus'} onClick={() => setMenuBox(false)}>
            BUS
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Header;
