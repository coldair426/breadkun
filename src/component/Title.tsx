import React from 'react';
import styles from '../style/Title.module.scss';
import classNames from 'classnames/bind';

const ts = classNames.bind(styles);

function Title({ title }: { title: string }) {
  return (
    <div className={ts('title')}>
      <button className={ts('title__before')}>
        <img className={ts('title__before-img')} src='/icon/title-before.png' alt='before-button' />
      </button>
      <div className={ts('title__name')}>{title}</div>
    </div>
  );
}

export default Title;
