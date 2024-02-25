export function cloneDate(d: Date) {
    return new Date(d.getTime());
}

//특정날짜에서 빼거나 더하도록 변경
export function addOrSubDays(type:string, d: Date | null, days: number) {
    const date = d === null ? new Date() : d;
    const newDate = cloneDate(date);
    if(type==='sub'){
        newDate.setDate(date.getDate() - days);

    } else{
        newDate.setDate(date.getDate() + days);
    }
    return newDate;
}

//Date 형식을 YYYYMMDD 형식으로 변경
export const formatDate = (date: Date, type:number) => {
    if (date === null) return '';
    if(type===1){
        return date.getFullYear() + ('00' + (date.getMonth() + 1)).slice(-2) + ('00' + date.getDate()).slice(-2);
    }
    if(type===2){
        const options = { month: '2-digit' as const, day: '2-digit' as const, weekday: 'short' as const };
        const formattedDate = new Intl.DateTimeFormat('ko-KR', options).format(date);
        return formattedDate.replace(/\.\s(?=\()/g, ' ')
    }
    return ''
};

export const formatTime=(date:Date)=>{
    return date.getHours()*60+date.getMinutes();
}

export const dayNumToSpell = (value: number): string => {
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