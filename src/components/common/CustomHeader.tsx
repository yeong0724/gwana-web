'use client';

import React, { useContext } from 'react';

import { ChevronLeft, Home } from 'lucide-react';

import { RouterWrapperContext } from '@/contexts/RouterWrapperContext';

type Props = {
  title: string;
};
const CustomHeader = ({ title }: Props) => {
  const { wrappedBack, wrappedPush } = useContext(RouterWrapperContext);

  return (
    <header className="relative flex items-center justify-center p-4 border-b border-gray-200 w-full flex-shrink-0 bg-white">
      <h1 className="text-[18px] font-semibold text-gray-900">{title}</h1>
      <button
        className="absolute left-4 p-2 hover:bg-gray-100 rounded-md transition-colors"
        onClick={wrappedBack}
      >
        <ChevronLeft size={20} className="text-gray-700 sm:w-6 sm:h-6" />
      </button>
      <button
        className="absolute right-3 sm:right-4 p-2 hover:bg-gray-100 rounded-md transition-colors"
        onClick={() => wrappedPush('/')}
      >
        <Home size={20} className="text-gray-700 sm:w-6 sm:h-6" />
      </button>
    </header>
  );
};

export default CustomHeader;
