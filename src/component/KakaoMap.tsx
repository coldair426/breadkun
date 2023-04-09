import React, { useEffect, useRef } from 'react';
import styles from '../style/KakaoMap.module.scss';
import classNames from 'classnames/bind';

const ks = classNames.bind(styles);

declare global {
  interface Window {
    kakao: any;
  }
}

function KakaoMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    const container = mapRef.current; // return 값 DOM
    const options = {
      center: new window.kakao.maps.LatLng(37.420125, 127.126665),
      level: 3,
    };
    new window.kakao.maps.Map(container, options);
  }, []);

  return <div ref={mapRef} className={ks('map')} />;
}

KakaoMap.defaultProps = {
  size: 'medium',
  color: 'blue',
};

export default KakaoMap;
