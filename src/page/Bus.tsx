import React, { useEffect, useState } from 'react';
import styles from '../style/Bus.module.scss';
import classNames from 'classnames/bind';
import Title from './../component/Title';
import KakaoMap from '../component/KakaoMap';

const bs = classNames.bind(styles);

function Bus() {
  const [latLong, setLatLong] = useState({ latitude: 37.756540912483615, longitude: 127.63819968679633 });
  useEffect(() => {
    // 페이지 최상단으로 스크롤링
    window.scrollTo(0, 0);
    // 현재위치를 최초 1회 제공
    navigator.geolocation.getCurrentPosition((position) => setLatLong({ latitude: position.coords.latitude, longitude: position.coords.longitude }));
  }, []);
  // 현재위치를 업데이트하는 함수
  const updateLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => setLatLong({ latitude: position.coords.latitude, longitude: position.coords.longitude }));
  };

  return (
    <div className={bs('bus')}>
      <Title letter='출퇴근 버스 정보' imgSrc='/icon/bus-title-icon.png' imgH='22px' />
      <div className={bs('bus__body')}>
        <KakaoMap latitude={latLong.latitude} longitude={latLong.longitude} />
        <div className={bs('bus__block1')}>
          <div className={bs('bus__block1--title')}>현재 위치에서 남은 시간</div>
          <div>latitude: {latLong.latitude}</div>
          <div>longitude: {latLong.longitude}</div>
          <button onClick={() => updateLocation()}>위치 새로고침</button>
        </div>
      </div>
    </div>
  );
}

export default Bus;
