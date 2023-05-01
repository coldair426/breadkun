import React, { useEffect, useState } from 'react';
import styles from '../style/Home.module.scss';
import classNames from 'classnames/bind';
import axios from 'axios';

const hs = classNames.bind(styles);

function Home({ setMenuBox }: { setMenuBox: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [company, setCompany] = useState(localStorage.getItem('recentCompany') || '강촌'); // 강촌, 을지

  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 최상단으로 스크롤링
  }, []);
  useEffect(() => {
    setMenuBox(false); // 메뉴 닫기(이전버튼 클릭시)
  }, [setMenuBox]);
  // 에어코리아 미세먼지, 초미세먼지
  useEffect(() => {
    localStorage.setItem('recentCompany', company); // 로컬 스토리지 업데이트
    const currentTime = new Date(); // 현재시간
    async function fetchData() {
      try {
        // 미세먼지 조회
        // const dustResult = await axios.get(
        //   `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=${
        //     company === '강촌' ? '가평' : '중구'
        //   }&ver=1.4&dataTerm=daily&pageNo=1&numOfRows=1&returnType=json&serviceKey=${process.env.REACT_APP_PUBLIC_OPEN_API_ENCODING_KEY}`
        // );
        // 날씨 조회
        const weatherResult = await axios.get(
          `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${process.env.REACT_APP_PUBLIC_OPEN_API_ENCODING_KEY}&numOfRows=10&pageNo=1&base_date=20230502&base_time=0630&nx=55&ny=127`
        );
        // console.log(dustResult.data.response.body.items[0]);
        console.log(weatherResult);
      } catch (error) {
        console.log('미세먼지 or 날씨 가져오기 실패.');
        console.log(error);
      }
    }
    fetchData();
  }, [company]);

  return (
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
  );
}

export default Home;
