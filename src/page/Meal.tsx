import React, { useEffect, useState, useRef } from 'react';
import styles from '../style/Meal.module.scss';
import classNames from 'classnames/bind';
// import axios from 'axios';
import mealData from '../meal-test-database.json';

const ms = classNames.bind(styles);

function Meal({ setMenuBox }: { setMenuBox: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [company, setCompany] = useState(localStorage.getItem('recentCompany') || '강촌'); // 강촌, 을지
  const [days, setDays] = useState<string[]>();
  const today = new Date().getDay() - 1; // 오늘 요일 표시 => 월:0 ~ 일:6
  const [selectedDay, setSelectedDay] = useState(0); // 기본값 월(0)
  const selectedDayRef = useRef<HTMLButtonElement>(null);
  const [selectedMealCategories, setSelectedMealCategories] = useState('조식'); // 기본값 조식
  const nowHours = new Date().getHours(); // 현재시간
  // testData
  const [testData, setTestData] = useState<Record<string, any>>({});
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
  // 숫자를 요일로 변환하는 함수
  const dayNumToSpell = (value: number): string => {
    switch (value) {
      case 0:
        return '월';
      case 1:
        return '화';
      case 2:
        return '수';
      case 3:
        return '목';
      case 4:
        return '금';
      case 5:
        return '토';
      case 6:
        return '일';
      default:
        return '월';
    }
  };
  // meal categories api binding을 위해 변환하는 함수
  const mealCategoriesEdit = (value: string): string => {
    switch (value) {
      case '조식':
        return '아침';
      case '중식':
        return '점심';
      case '석식':
        return '저녁';
      default:
        return '빵';
    }
  };
  const mealMunutitleEdit = (value: string): string => {
    switch (value) {
      case 'KOREAN1':
        return '한식';
      case 'KOREAN2':
        return '라면';
      case 'CONVENIENCE':
        return '간편식';
      case 'KOREAN':
        return '한식';
      case 'NOODLE':
        return '누들';
      case 'SPECIAL':
        return '일품';
      default:
        return '';
    }
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
  // 오늘을 선택하는 effect
  useEffect(() => {
    setSelectedDay(today);
  }, [company, today]);
  // 시간에 따라 조,중,석식 선택하는 effect
  useEffect(() => {
    if (nowHours < 9) {
      setSelectedMealCategories('조식');
    } else if (nowHours < 13) {
      setSelectedMealCategories('중식');
    } else {
      setSelectedMealCategories('석식');
    }
  }, [company, nowHours]);
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
  // selectedDay 자동 중앙 스크롤
  useEffect(() => {
    if (selectedDayRef.current) {
      const container = selectedDayRef.current.parentElement; // days
      if (container) {
        const { offsetLeft, clientWidth } = selectedDayRef.current;
        const containerWidth = container.clientWidth;
        const scrollOffset = offsetLeft - (containerWidth - clientWidth) / 2;
        const adjustedScrollOffset = scrollOffset;
        container.scrollTo({
          left: adjustedScrollOffset,
          behavior: 'smooth',
        });
      }
    }
  }, [selectedDay]);
  // test api
  useEffect(() => {
    company === '강촌' ? setTestData(mealData.강촌) : setTestData(mealData.을지);
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
  console.log(testData?.[dayNumToSpell(selectedDay)]?.[mealCategoriesEdit(selectedMealCategories)]);
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
        <div className={ms('days')}>
          {days?.map((day, index) => (
            <button
              key={index}
              ref={index === selectedDay ? selectedDayRef : undefined}
              onClick={() => {
                setSelectedMealCategories('조식');
                setSelectedDay(index);
              }}>
              <div className={index === selectedDay ? ms('day', 'selected-day') : ms('day')}>{index === today ? '오늘의 메뉴' : day}</div>
            </button>
          ))}
        </div>
        <div className={ms('meal__body')}>
          <div className={ms('meal-categories')}>
            {(company === '강촌' ? ['조식', '중식', '석식', '빵'] : ['조식', '중식', '석식']).map((v, index) => (
              <div
                className={selectedMealCategories === v ? ms('meal-category', 'selected-meal-category') : ms('meal-category')}
                onClick={() => setSelectedMealCategories(v)}
                key={index}>
                {v}
              </div>
            ))}
          </div>
          <div className={ms('meal-menus')}>
            {['SPECIAL', 'KOREAN1', 'KOREAN2', 'KOREAN', 'NOODLE', 'CONVENIENCE'].map((value) =>
              // CONVENIENCE 세분류로 나누기
              value === 'CONVENIENCE' ? (
                <div>간편식</div>
              ) : (
                testData?.[dayNumToSpell(selectedDay)]?.[mealCategoriesEdit(selectedMealCategories)]?.[value]?.메뉴 && (
                  <div className={ms('meal-menu')}>
                    <div className={ms('meal-menu__title--wrapper')}>
                      <div className={ms('meal-menu__title')}>{mealMunutitleEdit(value)}</div>
                      <div className={ms('meal-menu__name')}>{testData[dayNumToSpell(selectedDay)][mealCategoriesEdit(selectedMealCategories)][value]['메뉴'][0]}</div>
                    </div>
                    <div className={ms('meal-menu__body')}>
                      <div
                        className={ms('meal-menu__image')}
                        style={{
                          backgroundImage: `url(${
                            testData?.[dayNumToSpell(selectedDay)]?.[mealCategoriesEdit(selectedMealCategories)]?.[value]?.image !== ''
                              ? testData?.[dayNumToSpell(selectedDay)]?.[mealCategoriesEdit(selectedMealCategories)]?.[value]?.image
                              : '/icon/meal-default.png'
                          })`,
                        }}
                      />
                      <div className={ms('meal-menu__detaile')}>{testData[dayNumToSpell(selectedDay)][mealCategoriesEdit(selectedMealCategories)][value]['메뉴'].join(',')}</div>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Meal;
