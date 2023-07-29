import React from 'react';
import { Helmet } from 'react-helmet-async';

function BreadkunHelmet({ title, description, keywords, url, img }: { title: string; description: string; keywords: string; url: string; img: string }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='keywords' content={keywords} />
      <meta name='description' content={description} />
      {/* 오픈그래프(Open Graph) */}
      <meta property='og:type' content='website' />
      <meta property='og:url' content={url} />
      <meta property='og:image' content={img} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
    </Helmet>
  );
}

BreadkunHelmet.defaultProps = {
  title: '더존 빵돌이 | 다양한 더존ICT 생활 정보',
  description: '더존ICT의 구내식당 식단, 통근 버스의 실시간 도착 시간, 오늘의 빵, 사내 카페 메뉴, 날씨 등 다양한 생활 정보를 안내하는 더존 빵돌이 웹 서비스입니다.',
  keywords: '빵돌이, 더존ICT, 더존, 생활정보, 버스, 시간, 식당, 식단, 날씨, 회식장소, 맛집, 카페',
  url: 'https://breadkun.com/',
  img: './logo/og-image.png',
};
export default BreadkunHelmet;
