import React, { useEffect, useRef } from 'react';
import styles from '../style/PopUpMap.module.scss';
import classNames from 'classnames/bind';

declare global {
  interface Window {
    kakao: any;
  }
}
const ps = classNames.bind(styles);

function PopUpMap({
  onOffButton,
  stopLatLong,
  stopLocation,
}: {
  onOffButton: React.Dispatch<React.SetStateAction<boolean>>;
  stopLatLong: { latitude: number; longitude: number };
  stopLocation: string;
}) {
  useEffect(() => {
    const parentElement = document.body; // DOM의 body 태그 지정
    // MenuBox 마운트시,
    parentElement.style.overflow = 'hidden';
    parentElement.addEventListener('touchmove', handleTouchMove, { passive: false }); // Touch 디바이스 스크롤 정지
    // MenuBox 언마운트시,
    return () => {
      parentElement.style.overflow = 'auto';
      parentElement.removeEventListener('touchmove', handleTouchMove); // Touch 디바이스 스크롤 정지 해제
    };
  }, []);

  const handleTouchMove = (e: TouchEvent) => e.preventDefault();
  const mapRef = useRef(null);
  // 지도 생성(초기화)
  useEffect(() => {
    const container = mapRef.current; // return 값 DOM
    const options = {
      center: new window.kakao.maps.LatLng(stopLatLong.latitude, stopLatLong.longitude), // 지도 중심좌표
      mapTypeId: window.kakao.maps.MapTypeId.HYBRID,
      draggable: true, // 이동, 확대, 축소 금지
      disableDoubleClick: true, // 더블클릭 방지 옵션
      level: 2, // 지도 확대 레벨
    };
    const map = new window.kakao.maps.Map(container, options); // 지도생성
    // 더존_강촌의 위도 경도가 들어올 때,
    if (stopLatLong.latitude === 37.7577967099585 && stopLatLong.longitude === 127.63755797028342) {
    } else {
      const imageSrc = '/icon/busStop-marker.png'; // 마커이미지의 주소입니다
      const imageSize = new window.kakao.maps.Size(37, 41); // 마커이미지 크기
      const imageOption = { offset: new window.kakao.maps.Point(15, 35) }; // 마커이미지 옵션. 마커의 좌표와 일치시킬 이미지 안에서의 좌표 설정.
      // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
      const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
      const markerPosition = new window.kakao.maps.LatLng(stopLatLong.latitude, stopLatLong.longitude); // 마커 표시될 위치
      // 마커를 생성합니다
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImage, // 마커이미지 설정
      });
      // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(map);
    }
  }, [stopLatLong]);

  return (
    <div className={ps('pop-up-map')}>
      <div className={ps('pop-up-map__mask')} />
      <div className={ps('pop-up-map__kakao-map--wrapper')}>
        <div ref={mapRef} style={{ height: '93.4vw', width: '100%', borderRadius: '10.26vw', isolation: 'isolate' }} />
        <div className={ps('pop-up-map__location')}>{stopLocation}</div>
        <div className={ps('pop-up-map__close')} onClick={() => onOffButton(false)}>
          닫기
        </div>
      </div>
    </div>
  );
}

export default PopUpMap;
