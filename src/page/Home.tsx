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
  // 미세먼지, 초미세먼지 받아오기(async & await)
  useEffect(() => {
    async function fetchData() {
      try {
        if (company === '강촌') {
          // 강촌캠 기상 상태 조회
          const resultK = await axios.get(
            `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=가평&ver=1.4&dataTerm=daily&pageNo=1&numOfRows=1&returnType=json&serviceKey=${process.env.REACT_APP_AIRKOREA_DUST_API}`
          );
          console.log(resultK.data.response.body.items[0]);
        } else {
          // 을지타워 기상 상태 조회
          const resultS = await axios.get(
            `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=중구&ver=1.4&dataTerm=daily&pageNo=1&numOfRows=1&returnType=json&serviceKey=${process.env.REACT_APP_AIRKOREA_DUST_API}`
          );
          console.log(resultS.data.response.body.items[0]);
        }
      } catch (error) {
        console.log('error');
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
