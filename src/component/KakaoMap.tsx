import React, { useEffect, useRef } from 'react';
import styles from '../style/KakaoMap.module.scss';
import classNames from 'classnames/bind';

const ks = classNames.bind(styles);

declare global {
  interface Window {
    kakao: any;
  }
}

function KakaoMap({ latitude, longitude }: { latitude: number; longitude: number }) {
  const mapRef = useRef(null);
  // 지도 생성(초기화)
  useEffect(() => {
    const container = mapRef.current; // return 값 DOM
    const options = {
      center: new window.kakao.maps.LatLng(latitude, longitude),
      draggable: false, // 이동, 확대, 축소 금지
      level: 4, // 지도 확대 레벨
    };
    const map = new window.kakao.maps.Map(container, options); // 지도생성
  }, [latitude, longitude]);

  return <div ref={mapRef} className={ks('map')} />;
}

// KakaoMap.defaultProps = {
//   size: 'medium',
//   color: 'blue',
// };

export default KakaoMap;
