import React, { useEffect } from 'react';
import styles from '../style/Bus.module.scss';
import classNames from 'classnames/bind';
import Title from './../component/Title';

const bs = classNames.bind(styles);

function Bus() {
  useEffect(() => {
    window.scrollTo(0, 0); // scroll to the top of the page
  }, []);

  return (
    <div className={bs('bus')}>
      <Title title='출퇴근 버스 정보' />
      <div className={bs('bus__block1')}>
        <div className={bs('bus__block1--title')}>현재 위치에서 남은 시간</div>
      </div>
    </div>
  );
}

export default Bus;
