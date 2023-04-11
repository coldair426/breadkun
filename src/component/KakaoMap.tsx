import React, { useEffect, useRef } from 'react';
import styles from '../style/KakaoMap.module.scss';
import classNames from 'classnames/bind';

const ks = classNames.bind(styles);

declare global {
  interface Window {
    kakao: any;
  }
}

function KakaoMap({
  size,
  latitude,
  longitude,
  levelNum,
  draggableType,
  trafficInfo,
}: {
  size: string;
  latitude: number;
  longitude: number;
  levelNum: number;
  draggableType: boolean;
  trafficInfo: boolean;
}) {
  const mapRef = useRef(null);
  // 지도 생성(초기화)
  useEffect(() => {
    const container = mapRef.current; // return 값 DOM
    const options = {
      center: new window.kakao.maps.LatLng(latitude, longitude), // 지도 중심좌표
      draggable: draggableType, // 이동, 확대, 축소 금지
      level: levelNum, // 지도 확대 레벨
    };
    const map = new window.kakao.maps.Map(container, options); // 지도생성
    trafficInfo && map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC); // 교통정보
    const imageSrc = '/logo/breadkun-marker.png', // 마커이미지의 주소입니다
      imageSize = new window.kakao.maps.Size(37, 41), // 마커이미지 크기
      imageOption = { offset: new window.kakao.maps.Point(15, 35) }; // 마커이미지 옵션. 마커의 좌표와 일치시킬 이미지 안에서의 좌표 설정.
    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    var markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
      markerPosition = new window.kakao.maps.LatLng(latitude, longitude); // 마커 표시될 위치
    // 마커를 생성합니다
    var marker = new window.kakao.maps.Marker({
      position: markerPosition,
      image: markerImage, // 마커이미지 설정
    });
    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
  }, [latitude, longitude, levelNum, draggableType, trafficInfo]);

  return (
    <div className={ks('map-wrapper')}>
      <div ref={mapRef} className={ks('map', size)} />
    </div>
  );
}

KakaoMap.defaultProps = {
  size: 'large',
  latitude: 37.756540912483615,
  longitude: 127.63819968679633,
  levelNum: 5,
  draggableType: false,
  trafficInfo: false,
};

export default KakaoMap;
