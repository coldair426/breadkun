import React from 'react';
import '../style/Header.scss';

function Header() {
  return (
    <header className='header'>
      <div className='header__wrap'>
        <img className='header__logo' src='/logo/breadkunLogoDarkMode.png' alt='breadkun-header-logo' />
        <button>
          <img className='header__button' src='/icon/header-menu-button.png' alt='breadkun-header-menu' />
        </button>
      </div>
    </header>
  );
}

export default Header;
