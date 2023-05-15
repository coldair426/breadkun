import React, { useEffect, useState } from 'react';
import styles from '../style/Meal.module.scss';
import classNames from 'classnames/bind';
import axios from 'axios';

const ms = classNames.bind(styles);

function Meal({ setMenuBox }: { setMenuBox: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [company, setCompany] = useState(localStorage.getItem('recentCompany') || '강촌'); // 강촌, 을지

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
  // 로컬 스토리지 업데이트
  useEffect(() => {
    localStorage.setItem('recentCompany', company);
  }, [company]);
  // 식단 API 통신
  useEffect(() => {
    async function fetchMenuData() {
      try {
        // const result = await axios.get(
        //   company === '강촌' ? 'https://breadboy-7b329-default-rtdb.firebaseio.com/%EA%B0%95%EC%B4%8C' : 'https://breadboy-7b329-default-rtdb.firebaseio.com/%EC%9D%84%EC%A7%80'
        // );
        const result = await axios.get('https://breadboy-7b329-default-rtdb.firebaseio.com/%EA%B0%95%EC%B4%8C.json');
        console.log(result);
      } catch (error) {
        console.log('메뉴 가져오기 실패.');
        console.log(error);
      }
    }
    fetchMenuData();
  }, [company]);

  return (
    <>
      <div className={ms('meal')}>
        <div className={ms('title')}>
          <div className={ms('title__icon')}>
            <img src='/icon/meal-title-icon.png' alt='title' style={{ height: '5.64vw', maxHeight: '22px' }} />
          </div>
          <div className={ms('title__select')}>
            <div className={ms('title__letter')}>{company === '강촌' ? '강촌 식단' : '을지 식단'}</div>
            <select value={company} onChange={handleChange} aria-label='회사를 선택해 주세요.'>
              <option value='강촌'>강촌 식단</option>
              <option value='을지'>을지 식단</option>
            </select>
            <img className={ms('title__select-button')} src='/icon/home-select-arrow.png' alt='dropdown-button' />
          </div>
        </div>
        <div className={ms('meal__body')}></div>
      </div>
    </>
  );
}

export default Meal;
