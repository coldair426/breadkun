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
  const [dustRequestCompleted, setDustRequestCompleted] = useState(false);
  const [weatherRequestCompleted, setWeatherRequestCompleted] = useState(false);
  const [dust, setDust] = useState({ dataTime: '--', stationName: '--', pm10Level: '---', pm25Level: '---', pm10Value: '-', pm25Value: '-' });
  const [sky, setSky] = useState<WeatherReturn[] | undefined>(); // 하늘상태
  const [pty, setPty] = useState<WeatherReturn[] | undefined>(); // 강수형태
  const [rain, setRain] = useState<WeatherReturn[] | undefined>(); // 강수확률
  const [temperature, setTemperature] = useState<WeatherReturn[] | undefined>(); // 기온

  // 회사를 드롭다운에 따라 업데이트하는 함수
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCompany(e.target.value);
  };
  // 미세먼지 Level 리턴 함수
  const getPM10Level = (pm10Value: string): string => {
    if (pm10Value === '-') {
      return '통신장애';
    } else {
      const pm10 = +pm10Value;
      if (pm10 <= 30) {
        return '좋음';
      } else if (pm10 <= 50) {
        return '보통';
      } else if (pm10 <= 100) {
        return '나쁨';
      } else {
        return '최악';
      }
    }
  };
  // 초미세먼지 Level 리턴 함수
  const getPM25Level = (pm25Value: string): string => {
    if (pm25Value === '-') {
      return '통신장애';
    } else {
      const pm25 = +pm25Value;
      if (pm25 <= 15) {
        return '좋음';
      } else if (pm25 <= 25) {
        return '보통';
      } else if (pm25 <= 50) {
        return '나쁨';
      } else {
        return '최악';
      }
    }
  };
  const getWeatherIconPath = (ptyCode: string | undefined, skyCode: string | undefined): string | undefined => {
    const sunnyIcon = '/icon/weather/Sunny.png';
    const cloudyIcon = '/icon/weather/cloudy.png';
    const overcastIcon = '/icon/weather/overcast.png';
    const rainIcon = '/icon/weather/rain.png';
    const snowAndRainIcon = '/icon/weather/snowAndRain.png';
    const snowIcon = '/icon/weather/snow.png';
    // 강수형태가 0(없음) 일때,
    switch (ptyCode) {
      case '0':
        switch (skyCode) {
          case '1':
            return sunnyIcon;
          case '3':
            return cloudyIcon;
          case '4':
            return overcastIcon;
        }
        break;
      case '2':
        return snowAndRainIcon;
      case '3':
        return snowIcon;
    }
    return rainIcon;
  };
  const getWeatherTime = (fcstTime: string): string | undefined => {
    if (fcstTime && +fcstTime < 1200) {
      return `오전${fcstTime.slice(0, 2)}시`;
    } else if (fcstTime && +fcstTime < 2400) {
      return `오후${fcstTime.slice(0, 2)}시`;
    }
    return undefined;
  };

  // 메뉴 닫기(이전버튼 클릭시)
  useEffect(() => {
    setMenuBox(false);
  }, [setMenuBox]);
  // 페이지 최상단으로 스크롤링
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // 로컬 스토리지 업데이트
  useEffect(() => {
    localStorage.setItem('recentCompany', company);
  }, [company]);
  // 에어코리아 미세먼지, 초미세먼지
  useEffect(() => {
    setNotification(true);
    setDustRequestCompleted(false);
    async function fetchDustData() {
      setDust({ dataTime: '--', stationName: '--', pm10Level: '---', pm25Level: '---', pm10Value: '-', pm25Value: '-' });
      try {
        const dustResponse = await axios.get(
          `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=${
            company === '강촌' ? '가평' : '중구'
          }&ver=1.4&dataTerm=daily&pageNo=1&numOfRows=1&returnType=json&serviceKey=${process.env.REACT_APP_PUBLIC_OPEN_API_ENCODING_KEY}`
        );
        const { dataTime, stationName, pm10Value, pm25Value } = dustResponse.data.response.body.items[0];
        const pm10Level = getPM10Level(pm10Value);
        const pm25Level = getPM25Level(pm25Value);
        setDust({ dataTime, stationName, pm10Level, pm25Level, pm10Value, pm25Value });
        setDustRequestCompleted(true);
      } catch (error) {
        setDust({ dataTime: '--', stationName: '--', pm10Level: '통신장애', pm25Level: '통신장애', pm10Value: '-', pm25Value: '-' });
        setDustRequestCompleted(true);
        console.log('미세먼지 가져오기 실패.');
        console.log(error);
      }
    }
    fetchDustData();
  }, [company]);
  // 기상청 날씨
  useEffect(() => {
    const now = new Date(); // 현재 날짜
    const yesterday = new Date(now); // 어제 날짜
    yesterday.setDate(now.getDate() - 1); // 어제 날짜 설정
    // 달과 연도 넘어갈때 버그 방지 처리
    yesterday.getDate() > now.getDate() && yesterday.setMonth(yesterday.getMonth() - 1); // 현재 날짜와 어제 날짜의 일(day)이 다른 경우 이전 달로 설정
    // 현재 날짜 및 시간 포맷
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentDate = `${year}${month}${day}`; // 현재 날짜
    const currentTime = hour * 60 + minute; // 현재 시간(분으로 표시)
    // 어제 날짜 포맷
    const yesterdayYear = yesterday.getFullYear();
    const yesterdayMonth = (yesterday.getMonth() + 1).toString().padStart(2, '0');
    const yesterdayDay = yesterday.getDate().toString().padStart(2, '0');
    const yesterdayDate = `${yesterdayYear}${yesterdayMonth}${yesterdayDay}`; // 어제 날짜
    let baseDate = currentDate; // 조회날짜
    let baseTime = ''; // 조회시간
    // '0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300' 기상청 API 일 8회 업데이트 시간 1시간 후에 조회.
    if (currentTime < 180) {
      baseDate = yesterdayDate;
      baseTime = '2300';
    } else if (currentTime < 360) {
      baseTime = '0200';
    } else if (currentTime < 540) {
      baseTime = '0500';
    } else if (currentTime < 720) {
      baseTime = '0800';
    } else if (currentTime < 900) {
      baseTime = '1100';
    } else if (currentTime < 1080) {
      baseTime = '1400';
    } else if (currentTime < 1260) {
      baseTime = '1700';
    } else {
      baseTime = '2000';
    }
    setNotification(true);
    setWeatherRequestCompleted(false);
    async function fetchWeatherData() {
      setSky(undefined);
      setPty(undefined);
      setRain(undefined);
      setTemperature(undefined);
      try {
        const weatherResponse = await axios.get(
          `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${
            process.env.REACT_APP_PUBLIC_OPEN_API_ENCODING_KEY
          }&numOfRows=200&pageNo=1&dataType=json&base_date=${baseDate}&base_time=${baseTime}&nx=${company === '강촌' ? '71' : '60'}&ny=${company === '강촌' ? '132' : '127'}`
        );
        const weather = weatherResponse.data.response.body.items.item;
        const data = weather.reduce(
          (acc: { [key: string]: WeatherReturn[] }, currentVal: WeatherReturn) => {
            const { category, fcstDate, fcstTime } = currentVal;
            const isCurrentTime = +fcstDate > +currentDate || (+fcstDate === +currentDate && +fcstTime >= +hour.toString().padStart(2, '0').padEnd(4, '0'));
            if (isCurrentTime) {
              if (!acc[category]) {
                acc[category] = []; // 초기값 설정
              }
              acc[category].push(currentVal);
            }
            return acc;
          },
          { SKY: [], POP: [], REH: [], TMP: [] }
        );
        setSky(data.SKY);
        setPty(data.PTY);
        setRain(data.POP);
        setTemperature(data.TMP);
        setWeatherRequestCompleted(true);
      } catch (error) {
        setSky(undefined);
        setPty(undefined);
        setRain(undefined);
        setTemperature(undefined);
        setWeatherRequestCompleted(true);
        console.log('날씨 가져오기 실패.');
        console.log(error);
      }
    }
    fetchWeatherData();
  }, [company]);
  // 모든 통신이 완료되면 스낵바 언마운트
  useEffect(() => {
    if (dustRequestCompleted && weatherRequestCompleted) {
      setNotification(false);
    }
  }, [dustRequestCompleted, weatherRequestCompleted]);

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
            <div className={hs('home__weather--now')}>
              <div className={hs('home__weather--now-temperature')}>
                {pty?.[0].fcstValue && (
                  <img className={hs('home__weather--now-temperature-img')} src={getWeatherIconPath(pty?.[0].fcstValue, sky?.[0].fcstValue)} alt='weather-icon' />
                )}
                <div className={hs('home__weather--now-temperature-text')}>{`${temperature?.[0].fcstValue || '-'}°C`}</div>
              </div>
              <div className={hs('home__weather--now-rain')}>
                <img className={hs('home__weather--now-rain-img')} src='/icon/weather/popPercent.png' alt='rain-percent' />
                <div className={hs('home__weather--now-rain-text')}> {`${rain?.[0].fcstValue || '-'}%`}</div>
              </div>
            </div>
            <div className={hs('home__weather--forecasts')}>
              {new Array(12).fill('0').map((currentVal, index) => (
                <div className={hs('home__weather--forecast')} key={currentVal + index}>
                  <div className={hs('home__weather--forecast-time')} key={index}>
                    {getWeatherTime(temperature?.[index + 1].fcstTime || '')}
                  </div>
                  {pty?.[index + 1].fcstValue && (
                    <img
                      className={hs('home__weather--forecast-sky-icon')}
                      src={getWeatherIconPath(pty?.[index + 1].fcstValue, sky?.[index + 1].fcstValue)}
                      alt='weather-icon'
                      key={`a${index}`}
                    />
                  )}
                  <div className={hs('home__weather--forecast-temperature')} key={`d${index}`}>
                    {temperature?.[index + 1].fcstValue ? `${temperature?.[index + 1].fcstValue}°C` : ''}
                  </div>
                  {pty?.[index + 1].fcstValue && <img className={hs('home__weather--forecast-rain-img')} src='/icon/weather/popPercent.png' alt='rain-percent' key={`c${index}`} />}
                  <div className={hs('home__weather--forecast-rain-text')} key={`t${index}`}>
                    {rain?.[index + 1].fcstValue ? `${rain?.[index + 1].fcstValue}%` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={hs('home__dusts')}>
            <div className={hs('home__dust', dust.pm10Level === '---' ? '조회중' : dust.pm10Level)}>
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
            <div className={hs('home__ultra-dust', dust.pm25Level === '---' ? '조회중' : dust.pm25Level)}>
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
          <div className={hs('home__links')}>
            <button>
              <div className={hs('home__link')}>버스 정보 보기</div>
            </button>
            <button>
              <div className={hs('home__link')}>오늘의 식단 보기</div>
            </button>
          </div>
        </div>
      </div>
      {notification && <NotificationBox firstText={'기상상태 분석 중.'} secText={'잠시만 기다려 주세요.'} />}
    </>
  );
}

export default Home;
