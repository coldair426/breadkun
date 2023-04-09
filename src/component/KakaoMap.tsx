import React, { useEffect } from 'react';
import styles from '../style/KakaoMap.module.scss';
import classNames from 'classnames/bind';

const ks = classNames.bind(styles);

declare global {
  interface Window {
    kakao: any;
  }
}

function KakaoMap() {
  useEffect(() => {
    const container = document.querySelector('#map');
    const options = {
      center: new window.kakao.maps.LatLng(37.420125, 127.126665),
      level: 3,
    };
    new window.kakao.maps.Map(container, options);
  }, []);

  return <div id='map' className={ks('map')}></div>;
}

export default KakaoMap;
