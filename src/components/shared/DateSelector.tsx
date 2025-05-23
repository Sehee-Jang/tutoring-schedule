// 날짜 선택 상단 바 (공용 가능)
import { addDays, format, subDays } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { ko } from "date-fns/locale";
import Button from "./Button";

interface DateSelectorProps {
  date: Date;
  setDate: (newDate: Date) => void;
}

const DateSelector = ({ date, setDate }: DateSelectorProps) => {
  // 날짜 변경 핸들러
  const handlePrevDay = () => setDate(subDays(date, 1));
  const handleNextDay = () => setDate(addDays(date, 1));

  return (
    <div className='flex items-center justify-between bg-gray-50 rounded-md p-5 px-16'>
      <Button variant='icon' onClick={handlePrevDay}>
        <ChevronLeft className='w-5 h-5' />
      </Button>

      <div className='flex items-center gap-2 text-gray-900'>
        <Calendar className='w-5 h-5' />
        <span className='font-medium'>
          {format(date, "yyyy년 MM월 dd일 (EEEE)", { locale: ko })}
        </span>
      </div>

      <Button variant='icon' onClick={handleNextDay}>
        <ChevronRight className='w-5 h-5' />
      </Button>
    </div>
  );
};

export default DateSelector;
