import React from 'react';
import styles from '../style/Header.module.scss';
import classNames from 'classnames/bind';

const hs = classNames.bind(styles);

function Header() {
  return (
    <header className={hs('header')}>
      <div className={hs('header__wrap')}>
        <img className={hs('header__logo')} src='/logo/breadkunLogoDarkMode.png' alt='breadkun-header-logo' />
        <button>
          <img className={hs('header__button')} src='/icon/header-menu-button.png' alt='breadkun-header-menu' />
        </button>
      </div>
    </header>
  );
}

export default Header;
