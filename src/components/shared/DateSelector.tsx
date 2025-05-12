// 날짜 선택 상단 바 (공용 가능)
import { addDays, format, subDays } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { ko } from "date-fns/locale";

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
      <button
        onClick={handlePrevDay}
        className='text-gray-700 hover:text-black'
      >
        <ChevronLeft className='w-5 h-5' />
      </button>

      <div className='flex items-center gap-2 text-gray-900'>
        <Calendar className='w-5 h-5' />
        <span className='font-medium'>
          {format(date, "yyyy년 MM월 dd일 (EEEE)", { locale: ko })}
        </span>
      </div>
      <button
        onClick={handleNextDay}
        className='text-gray-700 hover:text-black'
      >
        <ChevronRight className='w-5 h-5' />
      </button>
    </div>
  );
};

export default DateSelector;
