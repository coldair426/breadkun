import React, { useEffect, useState } from 'react';
import styles from '../style/Bus.module.scss';
import classNames from 'classnames/bind';
import Title from './../component/Title';
import KakaoMap from '../component/KakaoMap';

const bs = classNames.bind(styles);

function Bus() {
  const [latLong, setLatLong] = useState({ latitude: 37.756540912483615, longitude: 127.63819968679633 });
  const [address, setAddress] = useState('강원도 춘천시 남산면 버들1길 130');
  useEffect(() => {
    // 페이지 최상단으로 스크롤링
    window.scrollTo(0, 0);
    // 현재위치를 최초 1회 제공
    navigator.geolocation.getCurrentPosition((position) => setLatLong({ latitude: position.coords.latitude, longitude: position.coords.longitude }));
  }, []);
  // 좌표 => 주소 변환하는 훅
  useEffect(() => {
    getAddr(latLong.latitude, latLong.longitude);
  }, [latLong]);

  // 현재위치를 업데이트하는 함수
  const updateLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => setLatLong({ latitude: position.coords.latitude, longitude: position.coords.longitude }));
  };

  // 좌표-주소 변환 함수
  const getAddr = (lat: number, lng: number) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    const coord = new window.kakao.maps.LatLng(lat, lng);
    const callback = (result: any, status: any) => {
      status === window.kakao.maps.services.Status.OK && setAddress(result[0].road_address.address_name);
    };
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  };

  return (
    <div className={bs('bus')}>
      <Title letter='출퇴근 버스 정보' imgSrc='/icon/bus-title-icon.png' imgH='22px' />
      <div className={bs('bus__body')}>
        <KakaoMap latitude={latLong.latitude} longitude={latLong.longitude} trafficInfo={true} />
        <div className={bs('bus__block1')}>
          <div className={bs('bus__block1--left')}>
            <div className={bs('bus__block--title')}>현재 위치에서 남은 시간</div>
            <div>주소: {address}</div>
          </div>
          <div className={bs('bus__block1--right')}>
            <div className={bs('bus__block--title')}>위치 새로고침</div>
            <button onClick={() => updateLocation()}>위치 새로고침</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bus;
