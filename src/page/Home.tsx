import React, { useEffect, useState } from 'react';
import styles from '../style/Home.module.scss';
import classNames from 'classnames/bind';
import axios from 'axios';

const hs = classNames.bind(styles);

function Home({ setMenuBox }: { setMenuBox: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [company, setCompany] = useState(localStorage.getItem('recentCompany') || '강촌'); // 강촌, 을지

  useEffect(() => {
    setMenuBox(false); // 메뉴 닫기(이전버튼 클릭시)
  }, [setMenuBox]);
  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 최상단으로 스크롤링
  }, []);
  // 에어코리아 미세먼지, 초미세먼지
  useEffect(() => {
    async function fetchData() {
      try {
        if (company === '강촌') {
          // 강촌캠 기상 상태 조회
          const resultK = await axios.get(
            `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=가평&ver=1.4&dataTerm=daily&pageNo=1&numOfRows=1&returnType=json&serviceKey=${process.env.REACT_APP_PUBLIC_OPEN_API_ENCODING_KEY}`
          );
          console.log(resultK.data.response.body.items[0]);
        } else {
          // 을지타워 기상 상태 조회
          const resultS = await axios.get(
            `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=중구&ver=1.4&dataTerm=daily&pageNo=1&numOfRows=1&returnType=json&serviceKey=${process.env.REACT_APP_PUBLIC_OPEN_API_ENCODING_KEY}`
          );
          console.log(resultS.data.response.body.items[0]);
        }
      } catch (error) {
        console.log('미세먼지, 초미세먼지 수치 가져오기 실패.');
        console.log(error);
      }
    }
    fetchData();
  }, [company]);
  // 기상청 날씨
  useEffect(() => {
    async function fetchData() {
      try {
        if (company === '강촌') {
          // 강촌캠 날씨 조회
          const resultK = await axios.get(
            `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${process.env.REACT_APP_PUBLIC_OPEN_API_ENCODING_KEY}&numOfRows=100&pageNo=1&dataType=json&base_date=20230501&base_time=1900&nx=71&ny=132`
          );
          console.log(resultK.data.response.body.items.item);
        } else {
          // 을지타워 날씨 조회
          const resultS = await axios.get(
            `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${process.env.REACT_APP_PUBLIC_OPEN_API_ENCODING_KEY}&numOfRows=100&pageNo=1&dataType=json&base_date=20230501&base_time=1900&nx=60&ny=127`
          );
          console.log(resultS.data.response.body.items.item);
        }
      } catch (error) {
        console.log('기상청 날씨 수치 가져오기 실패.');
        console.log(error);
      }
    }
    fetchData();
  }, [company]);
  useEffect(() => {
    localStorage.setItem('recentCompany', company); // 로컬 스토리지 업데이트
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
