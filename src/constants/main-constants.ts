import { AWS_S3_DOMAIN } from '@/constants';
import { HeroSlide } from '@/types';

export const heroSlides: HeroSlide[] = [
  {
    type: 'video',
    src: 'videos/main/gwana_main_video_1.mp4',
    hasSound: true,
    duration: 31,
    subtitle: '하동 지리산 자락에서',
    title: '자연이 빚은\n한 잔의 차',
  },
  {
    type: 'video',
    src: 'videos/main/gwana_main_video_2.mp4',
    hasSound: true,
    duration: 10,
    subtitle: '유기농 녹차 드립백',
    title: '느리게,\n정성으로',
    cta: '녹차 드립백 보러가기',
  },
  {
    type: 'image',
    src: `${AWS_S3_DOMAIN}images/about/mobile/gwana_about_01.webp`,
    hasSound: false,
    duration: 8,
    subtitle: '2025 봄 신차',
    title: '첫물의\n싱그러움',
    cta: '상품 둘러보기',
  },
];

export const categories = [
  {
    id: 'greenTea',
    name: '녹차',
    nameEn: 'Green Tea',
    image: 'https://picsum.photos/seed/gwana-green-tea/600/400',
    description: '지리산 하동의 유기농 녹차',
  },
  {
    id: 'substituteTea',
    name: '대용차',
    nameEn: 'Herbal Tea',
    image: 'https://picsum.photos/seed/gwana-herbal-tea/600/400',
    description: '논카페인 수제 블렌딩',
  },
];

export const brandStory = [
  {
    image: 'https://picsum.photos/seed/gwana-story1/600/800',
    label: '01',
    title: '지리산 하동',
    text: '천 년의 차 역사가 깃든 땅에서 직접 재배합니다.',
  },
  {
    image: 'https://picsum.photos/seed/gwana-story2/600/800',
    label: '02',
    title: '수작업 덖음',
    text: '솥에서 한 잎 한 잎 정성으로 덖어냅니다.',
  },
  {
    image: 'https://picsum.photos/seed/gwana-story3/600/800',
    label: '03',
    title: '자연 그대로',
    text: '유기농 인증, 어떤 화학물질도 사용하지 않습니다.',
  },
];

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  },
};
