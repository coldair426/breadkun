import React, { useEffect, useState } from 'react';
import styles from '../style/Home.module.scss';
import classNames from 'classnames/bind';
import NotificationBox from './../component/NotificationBox';
import axios from 'axios';

const hs = classNames.bind(styles);

function Home({ setMenuBox }: { setMenuBox: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [company, setCompany] = useState(localStorage.getItem('recentCompany') || '강촌'); // 강촌, 을지
  const [notification, setNotification] = useState(false);
  const [dust, setDust] = useState({ dataTime: '--', stationName: '--', pm10Level: '조회중', pm25Level: '조회중', pm10Value: '--', pm25Value: '--' });
  const [weather, setWeather] = useState([]);
  console.log(weather);

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
    const previousTime = new Date(now);
    previousTime.setHours(previousTime.getHours() - 1);
    const year = previousTime.getFullYear();
    const month = (previousTime.getMonth() + 1).toString().padStart(2, '0');
    const day = previousTime.getDate().toString().padStart(2, '0');
    const time = previousTime.getHours().toString().padStart(2, '0').padEnd(4, '0');
    const currentDate = `${year}${month}${day}`;
    const currentTime = `${time}`;

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
          `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${
            process.env.REACT_APP_PUBLIC_OPEN_API_ENCODING_KEY
          }&numOfRows=100&pageNo=1&dataType=json&base_date=${currentDate}&base_time=${currentTime}&nx=${company === '강촌' ? 71 : 60}&ny=${company === '강촌' ? 132 : 127}`
        );
        const [dustResult, weatherResult] = await axios.all([dustPromise, weatherPromise]); // 병렬통신
        // 미세먼지, 초미세먼지
        const { dataTime, stationName, pm10Value, pm25Value } = dustResult.data.response.body.items[0];
        let pm10Level = '';
        let pm25Level = '';
        // 미세먼지 Level
        if (+pm10Value >= 0 && +pm10Value <= 30) {
          pm10Level = '좋음';
        } else if (+pm10Value >= 31 && +pm10Value <= 50) {
          pm10Level = '보통';
        } else if (+pm10Value >= 51 && +pm10Value <= 100) {
          pm10Level = '나쁨';
        } else if (+pm10Value >= 101) {
          pm10Level = '최악';
        }
        // 초미세먼지 Level
        if (+pm25Value >= 0 && +pm25Value <= 15) {
          pm25Level = '좋음';
        } else if (+pm25Value >= 16 && +pm25Value <= 25) {
          pm25Level = '보통';
        } else if (+pm25Value >= 26 && +pm25Value <= 50) {
          pm25Level = '나쁨';
        } else if (+pm25Value >= 51) {
          pm25Level = '최악';
        }
        setDust({ dataTime, stationName, pm10Level, pm25Level, pm10Value, pm25Value });
        // 날씨
        setWeather(weatherResult.data.response.body.items.item);
        console.log(weatherResult.data.response.body.items.item);
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
            <img className={hs('title__select-button')} src='/icon/bus-stops-arrow.png' alt='dropdown-button' />
          </div>
        </div>
        <div className={hs('home__body')}>
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
