import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

function KakaoMap({
  mapHeight,
  mapWidth,
  latLong,
  levelNum,
  draggableType,
  trafficInfo,
}: {
  mapHeight: string;
  mapWidth: string;
  latLong: { latitude: number; longitude: number };
  levelNum: number;
  draggableType: boolean;
  trafficInfo: boolean;
}) {
  const [levelState, setLevelState] = useState(0);

  const mapRef = useRef(null);

  useEffect(() => {
    setLevelState(levelNum);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 지도 생성(초기화)
  useEffect(() => {
    const container = mapRef.current; // return 값 DOM
    const options = {
      center: new window.kakao.maps.LatLng(latLong.latitude, latLong.longitude), // 지도 중심좌표
      draggable: draggableType, // 이동, 확대, 축소 금지
      level: levelState, // 지도 확대 레벨
    };

    const map = new window.kakao.maps.Map(container, options); // 지도생성
    trafficInfo && map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC); // 교통정보

    const imageSrc = '/logo/breadkun-marker.png', // 마커이미지의 주소입니다
      imageSize = new window.kakao.maps.Size(37, 41), // 마커이미지 크기
      imageOption = { offset: new window.kakao.maps.Point(15, 35) }; // 마커이미지 옵션. 마커의 좌표와 일치시킬 이미지 안에서의 좌표 설정.
    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
      markerPosition = new window.kakao.maps.LatLng(latLong.latitude, latLong.longitude); // 마커 표시될 위치
    // 마커를 생성합니다
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      image: markerImage, // 마커이미지 설정
    });
    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
  }, [levelNum, draggableType, trafficInfo, latLong, levelState]);

  // webkit borderRadius와 overflow-hidden 적용시 버그 해결을 위한 isolation.
  return (
    <>
      <div ref={mapRef} style={{ height: mapHeight, width: mapWidth, borderRadius: '40px', isolation: 'isolate' }} />
      <button
        onClick={() => {
          setLevelState(levelState - 1);
        }}>
        확대
      </button>
      <button
        onClick={() => {
          setLevelState(levelState + 1);
        }}>
        축소
      </button>
    </>
  );
}

KakaoMap.defaultProps = {
  levelNum: 5,
  draggableType: false,
  trafficInfo: false,
};

export default KakaoMap;
