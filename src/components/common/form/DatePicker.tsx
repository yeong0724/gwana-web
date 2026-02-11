import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { DayPickerProps, Matcher } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type DatePickerProps = {
  /** 필드 이름 (콜백에서 구분 용도) */
  name: string;
  /** 선택된 날짜 */
  value: Date | undefined;
  /** 선택 불가능한 날짜 조건 */
  disabled?: Matcher | Matcher[];
  /** 플레이스홀더 텍스트 */
  placeholder?: string;
  /** 날짜 선택 콜백 (name, date 전달) */
  onSelectDate?: (name: string, date: Date | undefined) => void;
  /** PopoverContent 정렬 */
  align?: 'start' | 'center' | 'end';
  /** 버튼 추가 className */
  className?: string;
  /** 초기화 버튼 표출 여부 */
  useReset?: boolean;
  captionLayout?: DayPickerProps['captionLayout'];
};

const DatePicker = ({
  name,
  value,
  disabled,
  placeholder = '날짜 선택',
  onSelectDate,
  align = 'start',
  className,
  useReset = false,
  captionLayout = 'label',
}: DatePickerProps) => {
  const handleSelect = (date: Date | undefined) => {
    onSelectDate?.(name, date);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-label={name}
          className={cn(
            'h-9 w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'yyyy.MM.dd', { locale: ko }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <Calendar
          captionLayout={captionLayout}
          mode="single"
          selected={value}
          onSelect={handleSelect}
          locale={ko}
          disabled={disabled}
          useReset={useReset}
          onReset={() => handleSelect(undefined)}
          defaultMonth={value}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
