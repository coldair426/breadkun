import React, { useEffect, useState } from 'react';
import styles from '../style/Bus.module.scss';
import classNames from 'classnames/bind';
import { useParams } from 'react-router-dom';
import Title from './../component/Title';
import KakaoMap from '../component/KakaoMap';
import NotificationBox from './../component/NotificationBox';
import axios from 'axios';
import PopUpMap from './../component/PopUpMap';

const bs = classNames.bind(styles);

function Bus() {
  // URL parameter
  let { destination } = useParams();
  // 도착지 선택된 값 또는 "강변1"(기본값)
  const [selectedValue, setSelectedValue] = useState(destination || '강변1');
  // 현재위치 정보 lat&log
  const [latLong, setLatLong] = useState({ latitude: 37.756540912483615, longitude: 127.63819968679633 });
  // 현재위치 정보 도로명 주소
  const [address, setAddress] = useState({ region_1depth_name: '강원', region_2depth_name: '춘천시', region_3depth_name: '남산면' });
  // 도착시간
  const [arrivalTime, setArrivalTime] = useState({ mainbox: '-----', time: '', ampm: '', remainingTime: '', remainingText: '' });
  const [notification, setNotification] = useState(false);
  const [popUpMap, setPopUpMap] = useState(false);
  // test 서버
  const [stopsTest] = useState([
    {
      name: '더존_강촌',
      locaiton: '잠실역(2호선) 8번 출구 앞 버스정류장(잠실역 방면)',
      latitude: '37.7577967099585',
      longitude: '127.63755797028342',
    },
    {
      name: '천호역',
      locaiton: '천호역(5호선) 10번 출구 전방 150m 버스정류장 옆',
      longitude: '127.1219037455087',
      latitude: '37.53904703398166',
    },
    {
      name: '잠실역',
      locaiton: '잠실역(2호선) 8번 출구 앞 버스정류장(잠실역 방면)',
      longitude: '127.10159327577227',
      latitude: '37.514035653406545',
    },
    {
      name: '태릉',
      location: '태릉입구역(6호선) 7번 출구 전방 100m 버스정류장 옆',
      latitude: '37.617842488123095',
      longitude: '127.07656907083147',
    },
    {
      name: '구리',
      location: '구리패션아울렛 일룸 구리남양주점 앞',
      latitude: '37.60320736234289',
      longitude: '127.14653702691739',
    },
  ]);

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
                {/* <optgroup label='춘천방면'>
                  <option value='후평동1'>① 후평동</option>
                  <option value='후평동2'>② 후평동</option>
                  <option value='석사동3'>③ 석사동</option>
                  <option value='석사동4'>④ 석사동</option>
                </optgroup> */}
                <optgroup label='서울방면'>
                  <option value='강변1'>① 강변</option>
                  <option value='강변2'>② 강변</option>
                  <option value='천호'>③ 천호</option>
                  <option value='잠실'>④ 잠실</option>
                  <option value='태릉'>⑤ 태릉</option>
                  <option value='평내호평'>⑥ 평내호평</option>
                  <option value='상봉'>⑦ 상봉</option>
                  <option value='구리'>⑧ 구리</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>
        <div className={bs('bus__block2')}>
          <div className={bs('bus__block2--stops')}>
            {stopsTest.map((v, i) => (
              <div className={bs('bus__block2--stop')} key={i}>
                <div className={bs('bus__block2--stop-texts')} key={i}>
                  <div className={bs('bus__block2--stop-title-wrapper')}>
                    <div className={bs('bus__block2--stop-title')} key={`title${i}`}>
                      {i === 0 || i === stopsTest.length - 1 ? (i === 0 ? '기점' : '종점') : `경유${i}`}
                    </div>
                    <div className={bs('bus__block2--stop-name')} key={i}>
                      {v.name}
                    </div>
                  </div>
                  <div className={bs('bus__block2--stop-more')} onClick={() => setPopUpMap(true)}>
                    자세히 보기
                  </div>
                </div>
                <img className={bs('bus__block2--stop-arrow')} src='/icon/bus-stops-arrow.png' alt='down arrow' />
              </div>
            ))}
          </div>
        </div>
        {popUpMap && <PopUpMap onOffButton={setPopUpMap} />}
        {notification && <NotificationBox firstText={'시간 계산 중.'} secText={'위치 정보 허용 필요.'} />}
      </div>
    </div>
  );
}

export default Bus;
