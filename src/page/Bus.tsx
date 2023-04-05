import React from 'react';
import styles from '../style/Bus.module.scss';
import classNames from 'classnames/bind';

const bs = classNames.bind(styles);

function Bus() {
  return (
    <div className={bs('bus')}>
      <div className={bs('bus__contents')}></div>
    </div>
  );
}

export default Bus;
