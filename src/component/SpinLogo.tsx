import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../style/SpinLogo.module.scss';
import classNames from 'classnames/bind';

const ss = classNames.bind(styles);

function SpinLogo({ minHeight, text1, text2 }: { minHeight: string; text1: string; text2: string }) {
  return (
    <div className={ss('spinLogo')}>
      <div className={ss('spinLogo__wrap')} style={{ minHeight: minHeight }}>
        <Link to={'/'}>
          <img className={ss('spinLogo__wrap--logoImg')} src={'/logo/breadkunSpinLogo.png'} alt='logo' />
        </Link>
        <div>
          <div className={ss('spinLogo__wrap--text')}>{text1}</div>
          <div className={ss('spinLogo__wrap--text')}>{text2}</div>
        </div>
      </div>
    </div>
  );
}

SpinLogo.defaultProps = { minHeight: '100vh' };

export default SpinLogo;
