import React, { useEffect, useState, useRef } from 'react';
import styles from '../style/Meal.module.scss';
import classNames from 'classnames/bind';
import axios from 'axios';

const ms = classNames.bind(styles);

function Meal({ setMenuBox }: { setMenuBox: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [company, setCompany] = useState(localStorage.getItem('recentCompany') || '강촌'); // 강촌, 을지
  const [days, setDays] = useState<string[]>();
  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // 오늘 요일 표시 => 월:0 ~ 일:6
  const [selectedDay, setSelectedDay] = useState(0); // 기본값 월(0)
  const selectedDayRef = useRef<HTMLButtonElement>(null);
  const [selectedMealCategories, setSelectedMealCategories] = useState('조식'); // 기본값 조식
  const nowHours = new Date().getHours(); // 현재시간
  const [mealData, setMealData] = useState<Record<string, any>>({});
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
        return '아침';
    }
  };
  // 강촌 메뉴 그룹핑
  const kangchonMealMenutitleEdit = (value: string): string => {
    switch (value) {
      case 'KOREAN1':
        return '한식';
      case 'KOREAN2':
        return '라면';
      case 'SPECIAL':
        return '일품';
      case 'NOODLE':
        return '누들';
      case 'CONVENIENCE1':
      case 'CONVENIENCE2':
        return '간편식';
      case 'CONVENIENCE3':
        return '프로틴';
      default:
        return '';
    }
  };
  // 을지 메뉴 그룹핑
  const euljiMealMenutitleEdit = (value: string): string => {
    switch (value) {
      case 'KOREAN1':
        return '한식';
      case 'KOREAN2':
        return '라면';
      case 'SPECIAL':
        return '일품';
      case 'CONVENIENCE1':
        return '프레시박스';
      default:
        return '';
    }
  };
  // pixelImg 경로 선택 함수
  const mealPixelImgSrc = (value: string): string => {
    switch (value) {
      case 'SPECIAL':
        return "url('/icon/meal-special.webp')";
      case 'KOREAN1':
        return "url('/icon/meal-korfood.webp')";
      case 'KOREAN2':
        return "url('/icon/meal-ramen.webp')";
      case 'NOODLE':
        return "url('/icon/meal-noodle.webp')";
      case 'CONVENIENCE1':
      case 'CONVENIENCE2':
        return "url('/icon/meal-simpleFood.webp')";
      case 'CONVENIENCE3':
        return "url('/icon/meal-protein.webp')";
      default:
        return '';
    }
  };
  // menu name 자르는 함수
  const menuNameEdit = (value: string[]): string => {
    if (value[0] === '★특별한 한상★') {
      return value[1];
    } else {
      // "+", "(", " ", "&", "*" 5개로 자르는 정규식
      return value[0].split(/[+ (&*]/)[0];
    }
  };

  useEffect(() => {
    setMenuBox(false); // 메뉴 닫기(이전버튼 클릭시)
  }, [setMenuBox]);
  // 페이지 최상단으로 스크롤링
  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      window.scrollTo(0, 0);
    };
  }, []);
  // 로컬 스토리지 업데이트
  useEffect(() => {
    localStorage.setItem('recentCompany', company);
  }, [company]);
  // 오늘을 선택하는 effect
  useEffect(() => {
    if (company === '강촌') {
      setSelectedDay(today);
    } else {
      // 을지 주말 => 월요일 디폴트
      today < 5 ? setSelectedDay(today) : setSelectedDay(0);
    }
  }, [company, today]);
  // 시간에 따라 조,중,석식 선택하는 effect
  useEffect(() => {
    if (company === '강촌') {
      if (nowHours < 9) {
        setSelectedMealCategories('조식');
      } else if (nowHours < 13) {
        setSelectedMealCategories('중식');
      } else {
        setSelectedMealCategories('석식');
      }
    } else {
      if (today < 5) {
        if (nowHours < 9) {
          setSelectedMealCategories('조식');
        } else if (nowHours < 13) {
          setSelectedMealCategories('중식');
        } else {
          setSelectedMealCategories('석식');
        }
      } else {
        // 을지 주말 기본값 조식
        setSelectedMealCategories('조식');
      }
    }
  }, [company, today, nowHours]);
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
    const dates = getWeekDates(); // 강촌 주7일, 을지 주5일(주말X)
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
  }, [company, selectedDay]);
  // 식단 api
  useEffect(() => {
    async function fetchKangchonMealData() {
      try {
        const result = await axios.post('https://babkaotalk.herokuapp.com/api/webDiet', {
          location: '강촌',
        });
        setMealData(result.data.resultData);
      } catch (error) {
        console.log('메뉴 가져오기 실패.');
        console.log(error);
      }
    }
    async function fetchEuljiMealData() {
      try {
        const result = await axios.post('https://babkaotalk.herokuapp.com/api/webDiet', {
          location: '을지',
        });
        setMealData(result.data.resultData);
      } catch (error) {
        console.log('메뉴 가져오기 실패.');
        console.log(error);
      }
    }
    company === '강촌' ? fetchKangchonMealData() : fetchEuljiMealData();
  }, [company]);
  return (
    <>
      <div className={ms('meal')}>
        <div className={ms('title')}>
          <div className={ms('title__icon')}>
            <img src='/icon/meal-title-icon.webp' alt='title' style={{ height: '5.64vw', maxHeight: '22px' }} />
          </div>
          <div className={ms('title__select')}>
            <div className={ms('title__letter')}>{company === '강촌' ? '강촌 식단' : '을지 식단'}</div>
            <select value={company} onChange={handleChange} aria-label='회사를 선택해 주세요.'>
              <option value='강촌'>강촌 식단</option>
              <option value='을지'>을지 식단</option>
            </select>
            <img className={ms('title__select-button')} src='/icon/home-select-arrow.webp' alt='dropdown-button' />
          </div>
        </div>
        <div className={ms('days')}>
          {company === '강촌' &&
            days?.map((day, index) => (
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
          {company === '을지' &&
            days?.map((day, index) =>
              index < 5 ? (
                <button
                  key={index}
                  ref={index === selectedDay ? selectedDayRef : undefined}
                  onClick={() => {
                    setSelectedMealCategories('조식');
                    setSelectedDay(index);
                  }}>
                  <div className={index === selectedDay ? ms('day', 'selected-day') : ms('day')}>{index === today ? '오늘의 메뉴' : day}</div>
                </button>
              ) : undefined
            )}
        </div>
        <div className={ms('meal__body')}>
          <div className={ms('meal-categories')}>
            {['조식', '중식', '석식'].map((v, index) => (
              <div
                className={selectedMealCategories === v ? ms('meal-category', 'selected-meal-category') : ms('meal-category')}
                onClick={() => setSelectedMealCategories(v)}
                key={index}>
                {v}
              </div>
            ))}
          </div>
          <div className={ms('meal-menus')}>
            {company === '강촌' &&
              ['SPECIAL', 'KOREAN1', 'KOREAN2', 'NOODLE', 'CONVENIENCE1', 'CONVENIENCE2', 'CONVENIENCE3'].map(
                (value, index) =>
                  mealData?.[dayNumToSpell(selectedDay)]?.[mealCategoriesEdit(selectedMealCategories)]?.[value]?.메뉴 && (
                    <div className={ms('meal-menu')} key={index}>
                      <div className={ms('meal-menu__title--wrapper')}>
                        <div className={ms('meal-menu__title', `${value}`)}>{kangchonMealMenutitleEdit(value)}</div>
                        <div className={ms('meal-menu__name')}>{menuNameEdit(mealData[dayNumToSpell(selectedDay)][mealCategoriesEdit(selectedMealCategories)][value]['메뉴'])}</div>
                      </div>
                      <div className={ms('meal-menu__body')}>
                        <div
                          className={ms('meal-menu__image')}
                          style={{
                            backgroundImage:
                              mealData?.[dayNumToSpell(selectedDay)]?.[mealCategoriesEdit(selectedMealCategories)]?.[value]?.image !== ''
                                ? `url(${mealData?.[dayNumToSpell(selectedDay)]?.[mealCategoriesEdit(selectedMealCategories)]?.[value]?.image})`
                                : mealPixelImgSrc(value),
                          }}
                        />
                        <div className={ms('meal-menu__detaile')}>{mealData[dayNumToSpell(selectedDay)][mealCategoriesEdit(selectedMealCategories)][value]['메뉴'].join(',')}</div>
                      </div>
                    </div>
                  )
              )}
            {company === '을지' &&
              ['SPECIAL', 'KOREAN1', 'KOREAN2', 'CONVENIENCE1'].map(
                (value, index) =>
                  mealData?.[dayNumToSpell(selectedDay)]?.[mealCategoriesEdit(selectedMealCategories)]?.[value]?.메뉴 && (
                    <div className={ms('meal-menu')} key={index}>
                      <div className={ms('meal-menu__title--wrapper')}>
                        <div className={ms('meal-menu__title', `${value}`)}>{euljiMealMenutitleEdit(value)}</div>
                        <div className={ms('meal-menu__name')}>{menuNameEdit(mealData[dayNumToSpell(selectedDay)][mealCategoriesEdit(selectedMealCategories)][value]['메뉴'])}</div>
                      </div>
                      <div className={ms('meal-menu__body')}>
                        <div
                          className={ms('meal-menu__image')}
                          style={{
                            backgroundImage:
                              mealData?.[dayNumToSpell(selectedDay)]?.[mealCategoriesEdit(selectedMealCategories)]?.[value]?.image !== ''
                                ? `url(${mealData?.[dayNumToSpell(selectedDay)]?.[mealCategoriesEdit(selectedMealCategories)]?.[value]?.image})`
                                : mealPixelImgSrc(value),
                          }}
                        />
                        <div className={ms('meal-menu__detaile')}>{mealData[dayNumToSpell(selectedDay)][mealCategoriesEdit(selectedMealCategories)][value]['메뉴'].join(',')}</div>
                      </div>
                    </div>
                  )
              )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Meal;
