'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { forEach } from 'lodash-es';
import {
  ChevronRight,
  ClipboardList,
  MessageCircleQuestion,
  Truck,
  User,
  UserX2Icon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AWS_S3_DOMAIN } from '@/constants';
import useNativeRouter from '@/hooks/useNativeRouter';
import useRequireAuth from '@/hooks/useRequireAuth';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores';

// 하드코딩된 통계 데이터
const statsData = [
  {
    icon: Truck,
    count: 3,
    label: '주문내역',
    color: 'text-tea-600',
    bgColor: 'bg-tea-50',
  },
  {
    icon: ClipboardList,
    count: 1,
    label: '내가 쓴 리뷰',
    color: 'text-gold-500',
    bgColor: 'bg-gold-50',
  },
  {
    icon: MessageCircleQuestion,
    count: 0,
    label: '문의내역',
    color: 'text-brand-500',
    bgColor: 'bg-brand-50',
  },
];

// 메뉴 데이터
const menuItems = [
  { icon: User, label: '개인 정보 수정', url: '/mypage/myinfo' },
  { icon: MessageCircleQuestion, label: '문의 내역', url: '/mypage/inquiry' },
  { icon: ClipboardList, label: '리뷰 작성', url: '/mypage/review' },
  { icon: Truck, label: '주문 내역', url: '/mypage/orders' },
];

const MypageContainer = () => {
  useRequireAuth();

  const router = useRouter();
  const { forward } = useNativeRouter();
  const { user } = useUserStore();

  useEffect(() => {
    forEach(menuItems, ({ url }) => {
      router.prefetch(url);
    });
  }, []);

  const handleMenuClick = (url: string) => {
    // router.push(url);
    const productId = '2';
    if (url === '/mypage/review') {
      forward(`${url}?productId=${productId}`);
    } else {
      forward(url);
    }
  };

  return (
    <div className="bg-warm-50 py-6 px-4 flex flex-col overflow-y-auto flex-1">
      <div className="max-w-md mx-auto space-y-3 flex-1 w-full">
        {/* 섹션 1: 유저 정보 */}
        <Card className="py-0 overflow-hidden border-brand-200">
          <div className="p-6 bg-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-brand-100 border-2 border-brand-200 mr-[10px]">
                {!user.profileImage ? (
                  <div className="w-full h-full flex items-center justify-center bg-brand-100">
                    <span className="text-brand-400 text-2xl font-bold">
                      {user.username?.substring(0, 2)}
                    </span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`${AWS_S3_DOMAIN}${user.profileImage}`}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="text-warm-500 tracking-wider">
                <p className="text-[20px] font-bold text-brand-800 opacity-90">WELCOME</p>
                <p className="text-xl font-medium text-brand-700">{user.username} 님</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 섹션 2: 통계 */}
        <Card className="border-brand-200">
          <CardContent className="p-4 bg-white">
            <div className="grid grid-cols-3 gap-4">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`size-6 ${stat.color}`} />
                  </div>
                  <span className="text-2xl font-bold text-brand-800 tabular-nums">
                    {stat.count}
                  </span>
                  <span className="text-xs text-warm-400">{stat.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 섹션 3: 메뉴 리스트 */}
        <Card className="py-0 border-brand-200 overflow-hidden">
          <CardContent className="p-0 bg-white">
            <ul className="divide-y divide-brand-100">
              {menuItems.map(({ icon: Icon, label, url }, index) => (
                <li key={index}>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between px-4 py-4 h-auto hover:bg-brand-50 transition-colors rounded-none"
                    onClick={() => handleMenuClick(url)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="size-5 text-brand-400" />
                      <span className="text-brand-700">{label}</span>
                    </div>
                    <ChevronRight className="size-5 text-warm-300" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* 회원 탈퇴 버튼 - 맨 하단 고정 */}
      <div className="max-w-md mx-auto w-full py-4 flex items-center justify-center">
        <Button
          className={cn(
            'flex items-center justify-center',
            'text-[15px] text-red-400 hover:text-warm-500',
            'gap-2 transition-colors bg-transparent border-0 tracking-wider'
          )}
        >
          <UserX2Icon className="size-4" />
          <span>회원 탈퇴</span>
        </Button>
      </div>
    </div>
  );
};

export default MypageContainer;
