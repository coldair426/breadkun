import React, { useEffect, useState } from 'react';
import styles from '../style/Home.module.scss';
import classNames from 'classnames/bind';
import axios from 'axios';
import NotificationBox from './../component/NotificationBox';

const hs = classNames.bind(styles);

function Home({ setMenuBox }: { setMenuBox: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [company, setCompany] = useState(localStorage.getItem('recentCompany') || '강촌'); // 강촌, 을지
  const [dust, setDust] = useState({});
  const [weather, setWeather] = useState([]);
  const [notification, setNotification] = useState(false);

  console.log(dust);
  console.log(weather);

  useEffect(() => {
    setMenuBox(false); // 메뉴 닫기(이전버튼 클릭시)
  }, [setMenuBox]);
  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 최상단으로 스크롤링
  }, []);
  // 에어코리아 미세먼지, 초미세먼지
  useEffect(() => {
    localStorage.setItem('recentCompany', company); // 로컬 스토리지 업데이트
    const currentDate = new Date(); // 현재 날짜
    let date: string;
    let time: string;
    if (currentDate.getHours() === 0) {
      // 00시에는 하루전날 23시에 조회.
      date =
        `${currentDate.getFullYear()}` +
        (currentDate.getMonth() + 1 > 9 ? `${currentDate.getMonth() + 1}` : `0${currentDate.getMonth() + 1}`) +
        (currentDate.getDay() - 1 > 9 ? `${currentDate.getDay() - 1}` : `0${currentDate.getDay() - 1}`);
      time = '2300';
    } else {
      // yyyymmdd 형식으로 수정
      date =
        `${currentDate.getFullYear()}` +
        (currentDate.getMonth() + 1 > 9 ? `${currentDate.getMonth() + 1}` : `0${currentDate.getMonth() + 1}`) +
        (currentDate.getDay() > 9 ? `${currentDate.getDay()}` : `0${currentDate.getDay()}`);
      // hhmm 형식으로 수정 => 단, 분단위(mm)는 무조건 00분 이고 시간은 현재 시간에서 -1(한시간전) 조회
      time = (currentDate.getHours() - 1 > 9 ? `${currentDate.getHours() - 1}` : `0${currentDate.getHours() - 1}`) + '00';
    }
    async function fetchData() {
      setNotification(true);
      try {
        // 미세먼지 조회
        const dustResult = await axios.get(
          `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=${
            company === '강촌' ? '가평' : '중구'
          }&ver=1.4&dataTerm=daily&pageNo=1&numOfRows=1&returnType=json&serviceKey=${process.env.REACT_APP_PUBLIC_OPEN_API_ENCODING_KEY}`
        );
        setDust(dustResult.data.response.body.items[0]);
        // 날씨 조회
        const weatherResult = await axios.get(
          `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${
            process.env.REACT_APP_PUBLIC_OPEN_API_ENCODING_KEY
          }&numOfRows=100&pageNo=1&dataType=json&base_date=${date}&base_time=${time}&nx=${company === '강촌' ? 71 : 60}&ny=${company === '강촌' ? 132 : 127}`
        );
        setWeather(weatherResult.data.response.body.items.item);
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
        <div className={hs('home__body')}>
          <div className={hs('home__title')}>
            <button className={hs(company === '강촌' ? 'home__title-selected' : 'home__title-unselected')} onClick={() => setCompany('강촌')}>
              더존 강촌캠퍼스
            </button>
            <button className={hs(company === '을지' ? 'home__title-selected' : 'home__title-unselected')} onClick={() => setCompany('을지')}>
              더존 을지타워
            </button>
          </div>
        </div>
      </div>
      {notification && <NotificationBox firstText={'기상상태 분석 중.'} secText={'잠시만 기다려 주세요.'} />}
    </>
  );
}

export default Home;
