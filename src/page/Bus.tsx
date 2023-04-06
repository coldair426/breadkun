import React, { useEffect, useState } from 'react';
import styles from '../style/Bus.module.scss';
import classNames from 'classnames/bind';
import Title from './../component/Title';

const bs = classNames.bind(styles);

function Bus() {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  useEffect(() => {
    // 페이지 최상단으로 스크롤링
    window.scrollTo(0, 0);
    // 현재위치 업데이트
    navigator.geolocation.getCurrentPosition((position) => setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude }));
  }, []);

  const updateLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude }));
    console.log(location);
  };

  return (
    <div className={bs('bus')}>
      <Title letter='출퇴근 버스 정보' imgSrc='/icon/bus-title-icon.png' imgH='22px' />
      <div className={bs('bus__block1')}>
        <div className={bs('bus__block1--title')}>현재 위치에서 남은 시간</div>
        <div>latitude: {location.latitude}</div>
        <div>longitude: {location.longitude}</div>
        <button onClick={() => updateLocation()}>위치 새로고침</button>
      </div>
    </div>
  );
}

export default Bus;
