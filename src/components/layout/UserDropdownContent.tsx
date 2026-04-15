'use client';

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

type Props = {
  handleLogout: () => void;
  moveToMyPage: () => void;
  moveToOrderHistory: () => void;
};

const UserDropdownContent = ({ handleLogout, moveToMyPage, moveToOrderHistory }: Props) => {
  const arrowStyle = {
    width: 0,
    height: 0,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderBottom: '8px solid oklch(0.985 0.003 70)',
    filter: 'drop-shadow(0 -2px 2px oklch(0.35 0.07 40 / 0.08))',
  };

  const arrowBorderStyle = {
    width: 0,
    height: 0,
    borderLeft: '9px solid transparent',
    borderRight: '9px solid transparent',
    borderBottom: '9px solid oklch(0.87 0.03 65)',
  };

  return (
    <DropdownMenuContent
      align="end"
      sideOffset={4}
      className="w-48 scale-110 relative bg-warm-50 rounded-xl shadow-lg shadow-brand-900/10 border border-brand-200/60 p-2 !overflow-visible origin-top-right"
    >
      {/* 삼각형 화살표 */}
      <div className="absolute -top-2 right-[10%] z-10 pointer-events-none" style={arrowStyle} />
      <div
        className="absolute -top-2.5 right-[10%] z-0 pointer-events-none"
        style={arrowBorderStyle}
      />
      <DropdownMenuItem
        onClick={moveToMyPage}
        className="cursor-pointer text-base py-2.5 px-3 rounded-lg text-brand-800 hover:bg-brand-100 transition-colors duration-200"
      >
        마이페이지
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={moveToOrderHistory}
        className="cursor-pointer text-base py-2.5 px-3 rounded-lg text-brand-800 hover:bg-brand-100 transition-colors duration-200"
      >
        주문조회
      </DropdownMenuItem>
      <DropdownMenuSeparator className="my-1 bg-brand-200/40" />
      <DropdownMenuItem
        onClick={handleLogout}
        className="cursor-pointer text-base py-2.5 px-3 rounded-lg hover:bg-red-50 transition-colors duration-200 text-red-600 focus:text-red-600 focus:bg-red-50"
      >
        로그아웃
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default UserDropdownContent;
