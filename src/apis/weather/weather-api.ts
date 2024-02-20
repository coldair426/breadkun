import axios from "axios";

const cancelTokenSource = axios.CancelToken.source(); // 요청 취소 토큰

export interface WeatherReturn {
    baseDate: string;
    baseTime: string;
    category: string;
    fcstDate: string;
    fcstTime: string;
    fcstValue: string;
    nx: number;
    ny: number;
}

const now = new Date()
const yesterday = new Date(now.getDate()-1)
console.log('yesterday',yesterday);
const year = now.getFullYear();
// const month = (now.getMonth()+1).to

export const fetchWeatherData = async (company:string, baseDate:Date, baseTime:string)=>{
    const weatherResponse = await axios.get(`https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${
    process.env.REACT_APP_PUBLIC_OPEN_API_ENCODING_KEY
}&numOfRows=200&pageNo=1&dataType=json&base_date=${baseDate}&base_time=${baseTime}&nx=${company === '강촌' ? '71' : '60'}&ny=${company === '강촌' ? '132' : '127'}`,{
        cancelToken:cancelTokenSource.token, timeout:50000
    })
    const weather = weatherResponse.data.response.body.items.item;
    const weatherData = weather.reduce((acc:{[key in string]:WeatherReturn}, curr:WeatherReturn)=>{
        const {category, fcstDate, fcstTime} = curr;
        //카테고리가 같은 날씨 데이터끼리 묶기
        // const isCurrentTime = +fcstDate>+currentDate|| (+fcstDate === +currentDate && +fcstTime >= +hour.toString().padStart(2, '0').padEnd(4, '0'));
        return acc;
    },{SKY:[], POP:[], REH:[], TMP:[]})
}