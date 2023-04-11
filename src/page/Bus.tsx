import React, { useEffect, useState } from 'react';
import styles from '../style/Bus.module.scss';
import classNames from 'classnames/bind';
import Title from './../component/Title';
import KakaoMap from '../component/KakaoMap';

const bs = classNames.bind(styles);

function Bus() {
  const [latLong, setLatLong] = useState({ latitude: 37.756540912483615, longitude: 127.63819968679633 });
  const [address, setAddress] = useState({ region_1depth_name: '강원', region_2depth_name: '춘천시', region_3depth_name: '남산면' });

  useEffect(() => {
    // 페이지 최상단으로 스크롤링
    window.scrollTo(0, 0);
    // 현재위치 업데이트 최초 1회 업데이트
    updateLocation();
  }, []);

  // 현재 도로명 주소 업데이트
  useEffect(() => {
    getAddr(latLong.latitude, latLong.longitude);
  }, [latLong]);

  // 현재좌표를 업데이트 하는 함수
  const updateLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => setLatLong({ latitude: position.coords.latitude, longitude: position.coords.longitude }));
  };

  // 현재좌표 => 도로명 주소 변환 함수
  const getAddr = (lat: number, lng: number) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    const coord = new window.kakao.maps.LatLng(lat, lng);
    const callback = (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        // 글자 자르기
        setAddress({
          region_1depth_name:
            result[0].address.region_1depth_name.indexOf(' ') >= 0
              ? result[0].address.region_1depth_name.slice(0, result[0].address.region_1depth_name.indexOf(' '))
              : result[0].address.region_1depth_name,
          region_2depth_name:
            result[0].address.region_2depth_name.indexOf(' ') >= 0
              ? result[0].address.region_2depth_name.slice(0, result[0].address.region_2depth_name.indexOf(' '))
              : result[0].address.region_2depth_name,
          region_3depth_name:
            result[0].address.region_3depth_name.indexOf(' ') >= 0
              ? result[0].address.region_3depth_name.slice(0, result[0].address.region_3depth_name.indexOf(' '))
              : result[0].address.region_3depth_name,
        });
      }
    };
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  };

  return (
    <div className={bs('bus')}>
      <Title letter='퇴근 버스' imgSrc='/icon/bus-title-icon.png' imgH='22px' />
      <div className={bs('bus__body')}>
        <KakaoMap mapHeight={'180px'} mapWidth={'100%'} latLong={latLong} levelNum={5} draggableType={false} trafficInfo={true} />
        <div className={bs('bus__block1')}>
          <div className={bs('bus__block1--left')}>
            <div className={bs('bus__block1--left-title')}>
              <div>도착</div>
            </div>
            <div className={bs('bus__block1--left-firstLine')}>
              <div className={bs('bus__block1--left-firstLine-contents')}>
                <div>07:40</div>
                <div>PM</div>
              </div>
            </div>
            <div className={bs('bus__block1--left-secLine')}>
              <div className={bs('bus__block1--left-secLine-contents')}>
                <div>45</div>
                <div>분 뒤</div>
              </div>
            </div>
          </div>
          <div className={bs('bus__block1--right')}>
            <div className={bs('bus__block1--right--recentAdr')}>
              <div>{`${address.region_2depth_name} ${address.region_3depth_name}`}</div>
            </div>
            <div className={bs('bus__block1--right--arrow')}>
              <img className={bs('arrow-img')} src='/icon/arrow-down.png' alt='아래화살표' />
            </div>
            <div className={bs('bus__block1--right--selectbox')}>
              <select>
                <optgroup label='춘천방면'>
                  <option value='석사동'>석사동</option>
                  <option value='후평동'>후평동</option>
                  <option value='이마트'>이마트</option>
                </optgroup>
                <optgroup label='서울방면'>
                  <option value='강변'>강변</option>
                  <option value='천호'>천호</option>
                  <option value='잠실'>잠실</option>
                  <option value='태릉'>태릉</option>
                  <option value='평내호평'>평내호평</option>
                </optgroup>
              </select>
            </div>
            <div className={bs('bus__block1--right--refresh-button')}>
              <button onClick={() => updateLocation()}>
                <img className={bs('refresh-button')} src='/icon/bus-refresh-button.png' alt='refresh-button'></img>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bus;
