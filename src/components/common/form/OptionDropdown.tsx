'use client';

import { useState } from 'react';

import { map } from 'lodash-es';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { DropdownOption } from '@/types';

const OptionDropdown = ({
  options,
  onOptionSelect,
  placeholder = '옵션을 선택해주세요',
}: {
  options: DropdownOption[];
  onOptionSelect: (value: string) => void;
  placeholder?: string;
}) => {
  const [isOptionOpen, setIsOptionOpen] = useState(false);

  const handleSelect = (value: string) => {
    onOptionSelect?.(value);
    setIsOptionOpen(false);
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* 드롭다운 트리거 */}
      <button
        type="button"
        onClick={() => setIsOptionOpen(!isOptionOpen)}
        className="w-full h-11 px-3 flex items-center justify-between bg-gray-50 text-sm"
      >
        <span className="text-gray-500">{placeholder}</span>
        {isOptionOpen ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>

      {/* 옵션 목록 */}
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isOptionOpen ? 'max-h-60' : 'max-h-0'
        }`}
      >
        <div className="border-t border-gray-300">
          {map(options, (option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className="w-full px-3 py-3 text-left text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              {/* {option.optionName} (+ {localeFormat(option.optionPrice)}) */}
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OptionDropdown;
