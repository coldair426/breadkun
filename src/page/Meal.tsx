import React, {useEffect, useState, useRef} from 'react';
import styles from '../style/Meal.module.scss';
import classNames from 'classnames/bind';
import axios from 'axios';
import {getMealImagePath} from "../utils/image-return";
import {dayNumToSpell, formatDate} from "../utils/dates";
import {fetchMealData} from "../apis/meal/meal-api";
import {mealMenu} from "../types/common";

const ms = classNames.bind(styles);

function Meal({setMenuBox}: { setMenuBox: React.Dispatch<React.SetStateAction<boolean>> }) {
    // 주차를 구하는 함수
    const getWeekNumber = (date: Date): number => {
        // 월요일이 0이 되도록 요일을 조정합니다.
        const dayOfWeek = (date.getDay() + 6) % 7;
        // 현재 주의 월요일을 계산합니다.
        const monday = new Date(date);
        monday.setDate(date.getDate() - dayOfWeek);
        // 해당 주의 일요일을 계산합니다.
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        // 현재 날짜가 속한 주차를 계산합니다.
        const oneJan = new Date(date.getFullYear(), 0, 1);
        const daysUntilMonday = (monday.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000);
        const weekNumber = Math.ceil((daysUntilMonday + oneJan.getDay() + 1) / 7);
        return weekNumber;
    };

    const [company, setCompany] = useState(localStorage.getItem('recentCompany') || '강촌'); // 강촌, 을지
    const [days, setDays] = useState<string[]>();
    const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // 오늘 요일 표시 => 월:0 ~ 일:6
    const [selectedDay, setSelectedDay] = useState(0); // 기본값 월(0)
    const [weekNumber] = useState(getWeekNumber(new Date())); // 현재 주차 설정.
    const selectedDayRef = useRef<HTMLButtonElement>(null);
    const [selectedMealCategories, setSelectedMealCategories] = useState('조식'); // 기본값 조식
    const nowHours = new Date().getHours(); // 현재시간
    const [mealData, setMealData] = useState<Record<string, any>>({});
    // 회사를 드롭다운에 따라 업데이트하는 함수
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCompany(e.target.value);
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
            setSelectedDay(6);
        } else {
            // 을지 주말 => 월요일 디폴트
            today < 5 ? setSelectedDay(today) : setSelectedDay(0);
        }
    }, [company, today]);

    console.log(today)
    console.log(selectedDay)

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
                weekDates.push(formatDate(date, 2));
            }
            return weekDates;
        };
        console.log(getWeekDates());
        const dates = getWeekDates(); // 강촌 주7일, 을지 주5일(주말X)
        console.log(dates)
        setDays(dates);
    }, []);

    console.log(days)

    // selectedDay 자동 중앙 스크롤
    useEffect(() => {
        if (selectedDayRef.current) {
            const container = selectedDayRef.current.parentElement; // days
            if (container) {
                const {offsetLeft, clientWidth} = selectedDayRef.current;
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
        fetchMealData(company, weekNumber).then(res => {
            const {updated, ...rest} = res
            console.log(rest)
            setMealData(rest)
        })
    }, [company, weekNumber]);


    return (
        <>
            <div className={ms('meal')}>
                <div className={ms('title')}>
                    <div className={ms('title__icon')}>
                        <img src='/icon/meal-title-icon.webp' alt='title'
                             style={{height: '5.64vw', maxHeight: '22px'}}/>
                    </div>
                    <div className={ms('title__select')}>
                        <div className={ms('title__letter')}>{company === '강촌' ? '강촌 식단' : '을지 식단'}</div>
                        <select value={company} onChange={handleChange} aria-label='회사를 선택해 주세요.'>
                            <option value='강촌'>강촌 식단</option>
                            <option value='을지'>을지 식단</option>
                        </select>
                        <img className={ms('title__select-button')} src='/icon/home-select-arrow.webp'
                             alt='dropdown-button'/>
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
                                <div
                                    className={index === selectedDay ? ms('day', 'selected-day') : ms('day')}>{index === today ? '오늘의 메뉴' : day}</div>
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
                                    <div
                                        className={index === selectedDay ? ms('day', 'selected-day') : ms('day')}>{index === today ? '오늘의 메뉴' : day}</div>
                                </button>
                            ) : undefined
                        )}
                </div>
                <div className={ms('meal__body')}>
                    <div className={ms('meal-categories')}>
                        {mealMenu(company).mealTime.map((v, index) => (
                            <div
                                className={selectedMealCategories === v ? ms('meal-category', 'selected-meal-category') : ms('meal-category')}
                                onClick={() => setSelectedMealCategories(v)}
                                key={index}>
                                {v}
                            </div>
                        ))}
                    </div>
                    <div className={ms('meal-menus')}>
                        {mealMenu(company).menu.map(
                            (menu, index) => {
                                console.log(mealData)//{목:{아침:~}, {점심:~}, {저녁:~}}
                                // console.log(mealData[dayNumToSpell(selectedDay)]) //{아침:{"image": ""}, 점심:~}
                                console.log(selectedMealCategories)
                                // console.log(mealData[dayNumToSpell(selectedDay)][mealCategoriesEdit(selectedMealCategories)])
                                // {CONVENIENCE:{
                                //     "image": "",
                                //     "메뉴": [
                                //     "슈크림빵+컵시리얼"
                                // ]}
                                // }
                                return (
                                    mealData?.[dayNumToSpell(selectedDay)]?.[mealCategoriesEdit(selectedMealCategories)]?.[menu.value]?.메뉴 && (
                                        <div className={ms('meal-menu')} key={index}>
                                            <div className={ms('meal-menu__title--wrapper')}>
                                                <div
                                                    className={ms('meal-menu__title', `${menu.value}`)}>{menu.label}</div>
                                                <div
                                                    className={ms('meal-menu__name')}>{menuNameEdit(mealData[dayNumToSpell(selectedDay)][mealCategoriesEdit(selectedMealCategories)][menu.value]['메뉴'])}</div>
                                            </div>
                                            <div className={ms('meal-menu__body')}>
                                                <img className={ms('meal-menu__image')}
                                                     src={getMealImagePath(menu.value)}/>
                                                <div
                                                    className={ms('meal-menu__detaile')}>{mealData[dayNumToSpell(selectedDay)][mealCategoriesEdit(selectedMealCategories)][menu.value]['메뉴'].join(',')}</div>
                                            </div>
                                        </div>
                                    )
                                )
                            }
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Meal;
