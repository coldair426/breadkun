import React, { useEffect } from 'react';
import styles from '../style/Bus.module.scss';
import classNames from 'classnames/bind';

const bs = classNames.bind(styles);

function Bus() {
  useEffect(() => {
    window.scrollTo(0, 0); // scroll to the top of the page
  }, []);

  return (
    <div className={bs('bus')}>
      <div className={bs('bus__contents')}></div>
    </div>
  );
}

export default Bus;
