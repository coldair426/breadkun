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
export const formatDate = (date: Date) => {
    return date.getFullYear() + ('00' + (date.getMonth() + 1)).slice(-2) + ('00' + date.getDate()).slice(-2);
};

export const formatTime=(date:Date)=>{
    return date.getHours()*60+date.getMinutes();
}