import React, { useEffect, useState } from 'react';
import styles from '../style/Home.module.scss';
import classNames from 'classnames/bind';
import axios from 'axios';
import NotificationBox from './../component/NotificationBox';

interface WeatherReturn {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

const hs = classNames.bind(styles);

function Home({ setMenuBox }: { setMenuBox: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [company, setCompany] = useState(localStorage.getItem('recentCompany') || '강촌'); // 강촌, 을지
  const [notification, setNotification] = useState(false);
  const [dust, setDust] = useState({ dataTime: '--', stationName: '--', pm10Level: '조회중', pm25Level: '조회중', pm10Value: '-', pm25Value: '-' });
  const [sky, setSky] = useState([]); // 하늘상태
  const [rain, setRain] = useState([]); // 강수확률
  const [humidity, setHumidity] = useState([]); // 습도
  const [temperature, setTemperature] = useState([]); // 기온

  // 회사를 드롭다운에 따라 업데이트하는 함수
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCompany(e.target.value);
  };

  useEffect(() => {
    setMenuBox(false); // 메뉴 닫기(이전버튼 클릭시)
  }, [setMenuBox]);
  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 최상단으로 스크롤링
  }, []);
  // 에어코리아 미세먼지, 초미세먼지
  useEffect(() => {
    localStorage.setItem('recentCompany', company); // 로컬 스토리지 업데이트
    const now = new Date(); // 현재 날짜
    const yesterday = new Date(now); // 어제 날짜
    yesterday.setDate(now.getDate() - 1); // 어제 날짜 설정
    // 달과 연도 넘어갈때 버그 방지 처리
    yesterday.getDate() > now.getDate() && yesterday.setMonth(yesterday.getMonth() - 1); // 현재 날짜와 어제 날짜의 일(day)이 다른 경우 이전 달로 설정
    // 현재 날짜 및 시간 포맷
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const currentDate = `${year}${month}${day}`; // 현재 날짜
    const currentTime = `${hour}${minute}`; // 현재 시간
    // 어제 날짜 포맷
    const yesterdayYear = yesterday.getFullYear();
    const yesterdayMonth = (yesterday.getMonth() + 1).toString().padStart(2, '0');
    const yesterdayDay = yesterday.getDate().toString().padStart(2, '0');
    const yesterdayDate = `${yesterdayYear}${yesterdayMonth}${yesterdayDay}`; // 어제 날짜
    let baseDate = ''; // 조회 날짜
    let baseTime = ''; // 조회 시간
    // '0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300' 기상청 API 일 8회 업데이트 시간 1시간 후에 조회.
    if (+currentTime < 300) {
      baseDate = yesterdayDate;
      baseTime = '2300';
    } else if (+currentTime < 600) {
      baseDate = currentDate;
      baseTime = '0200';
    } else if (+currentTime < 900) {
      baseDate = currentDate;
      baseTime = '0500';
    } else if (+currentTime < 1200) {
      baseDate = currentDate;
      baseTime = '0800';
    } else if (+currentTime < 1500) {
      baseDate = currentDate;
      baseTime = '1100';
    } else if (+currentTime < 1800) {
      baseDate = currentDate;
      baseTime = '1400';
    } else if (+currentTime < 2100) {
      baseDate = currentDate;
      baseTime = '1700';
    } else {
      baseDate = currentDate;
      baseTime = '2000';
    }
    async function fetchData() {
      setNotification(true);
      try {
        // 미세먼지 조회
        const dustPromise = axios.get(
          `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=${
            company === '강촌' ? '가평' : '중구'
          }&ver=1.4&dataTerm=daily&pageNo=1&numOfRows=1&returnType=json&serviceKey=${process.env.REACT_APP_PUBLIC_OPEN_API_ENCODING_KEY}`
        );
        // 날씨 조회
        const weatherPromise = axios.get(
          `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${
            process.env.REACT_APP_PUBLIC_OPEN_API_ENCODING_KEY
          }&numOfRows=350&pageNo=1&dataType=json&base_date=${baseDate}&base_time=${baseTime}&nx=${company === '강촌' ? 71 : 60}&ny=${company === '강촌' ? 132 : 127}`
        );
        const [dustResult, weatherResult] = await axios.all([dustPromise, weatherPromise]); // 병렬통신
        // 미세먼지, 초미세먼지
        const { dataTime, stationName, pm10Value, pm25Value } = dustResult.data.response.body.items[0];
        let pm10Level = '';
        let pm25Level = '';
        // 미세먼지 Level
        if (pm10Value === '-') {
          pm10Level = '통신장애';
        } else if (+pm10Value >= 0 && +pm10Value <= 30) {
          pm10Level = '좋음';
        } else if (+pm10Value >= 31 && +pm10Value <= 50) {
          pm10Level = '보통';
        } else if (+pm10Value >= 51 && +pm10Value <= 100) {
          pm10Level = '나쁨';
        } else if (+pm10Value >= 101) {
          pm10Level = '최악';
        }
        // 초미세먼지 Level
        if (pm25Value === '-') {
          pm25Level = '통신장애';
        } else if (+pm25Value >= 0 && +pm25Value <= 15) {
          pm25Level = '좋음';
        } else if (+pm25Value >= 16 && +pm25Value <= 25) {
          pm25Level = '보통';
        } else if (+pm25Value >= 26 && +pm25Value <= 50) {
          pm25Level = '나쁨';
        } else if (+pm25Value >= 51) {
          pm25Level = '최악';
        }
        setDust({ dataTime, stationName, pm10Level, pm25Level, pm10Value, pm25Value });
        // 날씨정보, 현재 시각을 포함한 이상의 값만 가져오기.
        const weather = weatherResult.data.response.body.items.item.filter(
          (v: WeatherReturn) => +v.fcstDate > +currentDate || (+v.fcstDate === +currentDate && +v.fcstTime >= +hour.padEnd(4, '0'))
        );
        setSky(weather.filter((v: WeatherReturn) => v.category === 'SKY'));
        setRain(weather.filter((v: WeatherReturn) => v.category === 'POP'));
        setHumidity(weather.filter((v: WeatherReturn) => v.category === 'REH'));
        setTemperature(weather.filter((v: WeatherReturn) => v.category === 'TMP'));
        setNotification(false);
      } catch (error) {
        setNotification(false);
        console.log('날씨, 미세먼지 가져오기 실패.');
        console.log(error);
      }
    }
    fetchData();
  }, [company]);

  return (
    <>
      <div className={hs('home')}>
        <div className={hs('title')}>
          <div className={hs('title__icon')}>
            <img src='/icon/home-title-icon.png' alt='before-button' style={{ height: '5.64vw', maxHeight: '22px' }} />
          </div>
          <div className={hs('title__select')}>
            <div className={hs('title__letter')}>{company === '강촌' ? '더존 강촌캠퍼스' : '더존 을지타워'}</div>
            <select value={company} onChange={handleChange} aria-label='회사를 선택해 주세요.'>
              <option value='강촌'>더존 강촌캠퍼스</option>
              <option value='을지'>더존 을지타워</option>
            </select>
            <img className={hs('title__select-button')} src='/icon/home-select-arrow.png' alt='dropdown-button' />
          </div>
        </div>
        <div className={hs('home__body')}>
          <div className={hs('home__weather')}>
            날씨입니다.{sky.length} {humidity.length} {rain.length} {temperature.length}
          </div>
          <div className={hs('home__dusts')}>
            <div className={hs('home__dust', dust.pm10Level)}>
              <div className={hs('home__dust--title')}>
                <span>미세먼지</span>
                <img src='/icon/information.png' alt='information' />
              </div>
              <div className={hs('home__dust--img-letter-wrapper')}>
                {dust.pm10Level === '좋음' && <img className={hs('home__dust--img')} src='/icon/home-dusts-good.png' alt='dust-level-icon' />}
                {dust.pm10Level === '보통' && <img className={hs('home__dust--img')} src='/icon/home-dusts-nomal.png' alt='dust-level-icon' />}
                {dust.pm10Level === '나쁨' && <img className={hs('home__dust--img')} src='/icon/home-dusts-bad.png' alt='dust-level-icon' />}
                {dust.pm10Level === '최악' && <img className={hs('home__dust--img')} src='/icon/home-dusts-fuckingbad.png' alt='dust-level-icon' />}
                <div className={hs('home__dust--level')}>
                  {dust.pm10Level}/{dust.pm10Value}
                </div>
              </div>
            </div>
            <div className={hs('home__ultra-dust', dust.pm25Level)}>
              <div className={hs('home__ultra-dust--title')}>
                <span>초미세먼지</span>
                <img src='/icon/information.png' alt='information' />
              </div>
              <div className={hs('home__ultra-dust--img-letter-wrapper')}>
                {dust.pm25Level === '좋음' && <img className={hs('home__ultra-dust--img')} src='/icon/home-dusts-good.png' alt='dust-level-icon' />}
                {dust.pm25Level === '보통' && <img className={hs('home__ultra-dust--img')} src='/icon/home-dusts-nomal.png' alt='dust-level-icon' />}
                {dust.pm25Level === '나쁨' && <img className={hs('home__ultra-dust--img')} src='/icon/home-dusts-bad.png' alt='dust-level-icon' />}
                {dust.pm25Level === '최악' && <img className={hs('home__ultra-dust--img')} src='/icon/home-dusts-fuckingbad.png' alt='dust-level-icon' />}
                <div className={hs('home__ultra-dust--level')}>
                  {dust.pm25Level}/{dust.pm25Value}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {notification && <NotificationBox firstText={'기상상태 분석 중.'} secText={'잠시만 기다려 주세요.'} />}
    </>
  );
}

export default Home;
