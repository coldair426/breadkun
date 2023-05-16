import React, { useEffect, useState } from 'react';
import styles from '../style/Meal.module.scss';
import classNames from 'classnames/bind';
// import axios from 'axios';
// import mealData from '../meal-test-database.json';

const ms = classNames.bind(styles);

function Meal({ setMenuBox }: { setMenuBox: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [company, setCompany] = useState(localStorage.getItem('recentCompany') || '강촌'); // 강촌, 을지
  const [days, setDays] = useState<string[]>();
  // const today = new Date().getDay() - 1; // 오늘 요일 표시 => 월:0 ~ 일:6
  // const nowHours = new Date().getHours(); // 현재시간

  // 회사를 드롭다운에 따라 업데이트하는 함수
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCompany(e.target.value);
  };
  // 날짜 형식 추출/조합 함수
  const formatDate = (date: Date): string => {
    const options = { month: '2-digit' as const, day: '2-digit' as const, weekday: 'short' as const };
    const formattedDate = new Intl.DateTimeFormat('ko-KR', options).format(date);
    const [month, day, weekday] = formattedDate.split('. ');
    return `${month}.${day}${weekday}`;
  };

  useEffect(() => {
    setMenuBox(false); // 메뉴 닫기(이전버튼 클릭시)
  }, [setMenuBox]);
  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 최상단으로 스크롤링
  }, []);
  useEffect(() => {
    // 오늘을 포함한 주차의 월요일~일요일까지의 날짜 데이터 배열리턴 함수
    const getWeekDates = () => {
      const today = new Date(); // 현재 date
      const currentDay = today.getDay(); // 요일 가져오기
      const weekStart = new Date(today); // today date 복사
      currentDay === 0 ? weekStart.setDate(today.getDate() - 6) : weekStart.setDate(today.getDate() - currentDay + 1); // 일요일 일때 ? 이전 주의 월요일 : 월요일 시작
      const weekDates: string[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i); // 주의 시작일로부터 i일씩 증가하여 주간 날짜 생성
        weekDates.push(formatDate(date));
      }
      return weekDates;
    };
    const dates = getWeekDates();
    setDays(dates);
  }, []);
  // 로컬 스토리지 업데이트
  useEffect(() => {
    localStorage.setItem('recentCompany', company);
  }, [company]);
  // 식단 API 통신
  // useEffect(() => {
  //   async function fetchMealData() {
  //     try {
  //       const result = await axios.get('https://breadboy-7b329-default-rtdb.firebaseio.com/%EA%B0%95%EC%B4%8C.json');
  //       console.log(result);
  //     } catch (error) {
  //       console.log('메뉴 가져오기 실패.');
  //       console.log(error);
  //     }
  //   }
  //   fetchMealData();
  // }, [company]);

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
        <div className={ms('meal__body')}>
          <div className={ms('days')}>
            {days?.map((day) => (
              <button>
                <div className={ms('day')}>{day}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Meal;
