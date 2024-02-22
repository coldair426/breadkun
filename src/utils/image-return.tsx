export const imageReturn = (pmText: string): string => {
    const baseDustImageUrl = "/icon/home/dust"
            switch (pmText) {
                case '좋음':
                    return `${baseDustImageUrl}/good.webp`;
                case '보통':
                    return `${baseDustImageUrl}/normal.webp`;
                case '나쁨':
                    return `${baseDustImageUrl}/bad.webp`;
                case '최악':
                    return `${baseDustImageUrl}/fuckingbad.webp`;
                default:
                     return `${baseDustImageUrl}/normal.webp`;
            }
};

export const getWeatherIconPath = (ptyCode: string | undefined, skyCode: string | undefined): string | undefined => {
    const sunnyIcon = '/icon/weather/Sunny.webp';
    const cloudyIcon = '/icon/weather/cloudy.webp';
    const overcastIcon = '/icon/weather/overcast.webp';
    const rainIcon = '/icon/weather/rain.webp';
    const snowAndRainIcon = '/icon/weather/snowAndRain.webp';
    const snowIcon = '/icon/weather/snow.webp';
    // 강수형태가 0(없음) 일때,
    switch (ptyCode) {
        case '0':
            switch (skyCode) {
                case '1':
                    return sunnyIcon;
                case '3':
                    return cloudyIcon;
                case '4':
                    return overcastIcon;
            }
            break;
        case '2':
            return snowAndRainIcon;
        case '3':
            return snowIcon;
    }
    return rainIcon;
};