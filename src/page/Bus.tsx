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
      status === window.kakao.maps.services.Status.OK && setAddress(result[0].address);
    };
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  };

  return (
    <div className={bs('bus')}>
      <Title letter='출퇴근 버스' imgSrc='/icon/bus-title-icon.png' imgH='22px' />
      <div className={bs('bus__body')}>
        <KakaoMap mapHeight={'180px'} mapWidth={'100%'} latLong={latLong} levelNum={5} draggableType={false} trafficInfo={true} />
        <div className={bs('bus__block1')}>
          <div className={bs('bus__block1--left')}>
            <div className={bs('bus__block1--left-firstLine')}>
              <div>
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
              <div>까지</div>
            </div>
            <div className={bs('bus__block1--left-secoundLine')}>
              <div>45</div>
              <div>분</div>
            </div>
          </div>
          <div className={bs('bus__block1--right')}>
            <div>
              <div className={bs('blcok1--right--sententce')}>{`${address.region_1depth_name} ${address.region_2depth_name}`}</div>
              <div className={bs('blcok1--right--sententce')}>{address.region_3depth_name}</div>
            </div>
            <div>
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
