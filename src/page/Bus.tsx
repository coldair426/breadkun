import React, { useEffect, useState } from 'react';
import styles from '../style/Bus.module.scss';
import classNames from 'classnames/bind';
import { useParams } from 'react-router-dom';
import Title from './../component/Title';
import KakaoMap from '../component/KakaoMap';
import NotificationBox from './../component/NotificationBox';
import axios from 'axios';

const bs = classNames.bind(styles);

function Bus() {
  // URL parameter
  let { destination } = useParams();
  // 도착지 선택된 값 또는 "석사동"(기본값)
  const [selectedValue, setSelectedValue] = useState(destination || '석사동');
  // 현재위치 정보 lat&log
  const [latLong, setLatLong] = useState({ latitude: 37.756540912483615, longitude: 127.63819968679633 });
  // 현재위치 정보 도로명 주소
  const [address, setAddress] = useState({ region_1depth_name: '강원', region_2depth_name: '춘천시', region_3depth_name: '남산면' });
  // 도착시간
  const [arrivalTime, setArrivalTime] = useState({ mainbox: '-----', time: '', ampm: '', remainingTime: '', remainingText: '' });
  const [notification, setNotification] = useState(false);

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
  // 서버에서 남은 시간 받아오기 비동기 처리(async & await)
  useEffect(() => {
    async function fetchData() {
      setNotification(true);
      try {
        const result = await axios.post('https://babkaotalk.herokuapp.com/webShuttle', {
          destNm: selectedValue,
          originGps: `${latLong.longitude},${latLong.latitude} `,
        });
        const { resultCode, resultData } = result.data;
        if (resultCode === 104) {
          setArrivalTime({ mainbox: '잠시 후 도착', time: '', ampm: '', remainingTime: '', remainingText: '' });
        } else {
          const resultVal = resultData;
          let resultH = resultVal.arrivalTimeH > 12 ? resultVal.arrivalTimeH - 12 : resultVal.arrivalTimeH;
          setArrivalTime({
            mainbox: '',
            time: `${resultH < 10 ? '0' + resultH : resultH}:${resultVal.arrivalTimeM < 10 ? '0' + resultVal.arrivalTimeM : resultVal.arrivalTimeM}`,
            ampm: `${resultVal.arrivalTimeH >= 12 ? 'PM' : 'AM'}`,
            remainingTime: `${resultVal.durationH * 60 + resultVal.durationM}`,
            remainingText: '분 남음',
          });
        }
        setNotification(false);
      } catch (error) {
        setArrivalTime({ mainbox: '-----', time: '', ampm: '', remainingTime: '', remainingText: '' });
        setNotification(false);
      }
    }
    fetchData();
  }, [selectedValue, latLong]);
  // 서버에서 남은 시간 받아오기
  // useEffect(() => {
  //   setNotification(true);
  //   axios
  //     .post('https://babkaotalk.herokuapp.com/webShuttle', { destNm: selectedValue, originGps: `${latLong.longitude},${latLong.latitude} ` })
  //     .then((result) => {
  //       // result.data.resultCode===104 => 출발지 & 도착지 5m이내 의미
  //       if (result.data.resultCode === 104) {
  //         setArrivalTime({ mainbox: '잠시 후 도착', time: '', ampm: '', remainingTime: '', remainingText: '' });
  //       } else {
  //         const resultVal = result.data.resultData;
  //         let resultH = resultVal.arrivalTimeH > 12 ? resultVal.arrivalTimeH - 12 : resultVal.arrivalTimeH;
  //         // 리턴값
  //         setArrivalTime({
  //           mainbox: '',
  //           time: `${resultH < 10 ? '0' + resultH : resultH}:${resultVal.arrivalTimeM < 10 ? '0' + resultVal.arrivalTimeM : resultVal.arrivalTimeM}`,
  //           ampm: `${resultVal.arrivalTimeH >= 12 ? 'PM' : 'AM'}`,
  //           remainingTime: `${resultVal.durationH * 60 + resultVal.durationM}`,
  //           remainingText: '분 남음',
  //         });
  //       }
  //       setNotification(false);
  //     })
  //     .catch(() => {
  //       setArrivalTime({ mainbox: '-----', time: '', ampm: '', remainingTime: '', remainingText: '' });
  //       setNotification(false);
  //     });
  // }, [selectedValue, latLong]);

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
  // 도착지 값을 드롭다운에 따라 업데이트하는 함수
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
  };

  return (
    <div className={bs('bus')}>
      <Title letter='퇴근 버스' imgSrc='/icon/bus-title-icon.png' imgH='22px' />
      <div className={bs('bus__body')}>
        <KakaoMap mapHeight={'250px'} mapWidth={'100%'} latLong={latLong} levelNum={5} draggableType={true} trafficInfo={true} />
        <div className={bs('bus__block1')}>
          <div className={bs('bus__block1--left')}>
            <div className={bs('bus__block1--left-title')}>
              <img src='/icon/bus-arrival-icon.png' alt='arrival icon' />
            </div>
            <div className={bs('bus__block1--left-mainBox')}>{arrivalTime.mainbox}</div>
            <div className={bs('bus__block1--left-firstLine')}>
              <div className={bs('bus__block1--left-firstLine-contents')}>
                <div>{arrivalTime.time}</div>
                <div>{arrivalTime.ampm}</div>
              </div>
            </div>
            <div className={bs('bus__block1--left-secLine')}>
              <div className={bs('bus__block1--left-secLine-contents')}>
                <div>{arrivalTime.remainingTime}</div>
                <div>{arrivalTime.remainingText}</div>
              </div>
            </div>
          </div>
          <div className={bs('bus__block1--right')}>
            <div>
              <div className={bs('bus__block1--right--recentAdr')}>
                <div>{address.region_2depth_name}</div>
                <div>{address.region_3depth_name}</div>
              </div>
              <div className={bs('bus__block1--right--refresh-button')}>
                <button onClick={() => updateLocation()}>
                  <img className={bs('refresh-button')} src='/icon/bus-refresh-button.png' alt='refresh-button'></img>
                </button>
              </div>
            </div>
            <div className={bs('bus__block1--right--arrow')}>
              <img className={bs('arrow-img')} src='/icon/arrow-down.png' alt='아래화살표' />
            </div>
            <div className={bs('bus__block1--right--selectbox')}>
              <select value={selectedValue} onChange={handleChange}>
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
                  <option value='상봉'>상봉</option>
                  <option value='구리'>구리</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>
        {notification && <NotificationBox firstText={'시간 계산 중.'} secText={'위치 정보 허용 필요.'} />}
      </div>
    </div>
  );
}

export default Bus;
