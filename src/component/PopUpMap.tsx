import React, { useEffect, useRef } from 'react';
import styles from '../style/PopUpMap.module.scss';
import classNames from 'classnames/bind';

declare global {
  interface Window {
    kakao: any;
  }
}
const ps = classNames.bind(styles);

function PopUpMap({ onOffButton }: { onOffButton: React.Dispatch<React.SetStateAction<boolean>> }) {
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
      center: new window.kakao.maps.LatLng(37.7577967099585, 127.63755797028342), // 지도 중심좌표
      draggable: true, // 이동, 확대, 축소 금지
      disableDoubleClick: true, // 더블클릭 방지 옵션
      level: 3, // 지도 확대 레벨
    };
    const map = new window.kakao.maps.Map(container, options); // 지도생성
    map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC); // 교통정보
    const imageSrc = '/logo/breadkun-marker.png', // 마커이미지의 주소입니다
      imageSize = new window.kakao.maps.Size(37, 41), // 마커이미지 크기
      imageOption = { offset: new window.kakao.maps.Point(15, 35) }; // 마커이미지 옵션. 마커의 좌표와 일치시킬 이미지 안에서의 좌표 설정.
    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
      markerPosition = new window.kakao.maps.LatLng(37.7577967099585, 127.63755797028342); // 마커 표시될 위치
    // 마커를 생성합니다
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      image: markerImage, // 마커이미지 설정
    });
    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
  }, []);

  return (
    <div className={ps('pop-up-map')}>
      <div className={ps('pop-up-map__mask')} onClick={() => onOffButton(false)} />
      <div className={ps('pop-up-map__kakao-map--wrapper')}>
        <div ref={mapRef} style={{ height: '500px', width: '100%', borderBottomRightRadius: '40px', borderBottomLeftRadius: '40px', isolation: 'isolate' }} />
      </div>
      <div className={ps('pop-up-map__close')} onClick={() => onOffButton(false)}>
        닫기
      </div>
    </div>
  );
}

export default PopUpMap;
