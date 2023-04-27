import React from 'react';
import styles from '../style/Title.module.scss';
import classNames from 'classnames/bind';

const ts = classNames.bind(styles);

function Title({ letter, imgSrc, imgH }: { letter: string; imgSrc: string; imgH: string }) {
  return (
    <div className={ts('title')}>
      <div className={ts('title__icon')}>
        <img
          src={imgSrc}
          alt='before-button'
          style={{
            height: imgH,
          }}
        />
      </div>
      <div className={ts('title__letter')}>{letter}</div>
    </div>
  );
}

export default Title;
