import { addDays, format, isToday, subDays } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { ko } from "date-fns/locale";
import Button from "./Button";


interface DateSelectorProps {
  date: Date;
  setDate: (newDate: Date) => void;
}

const DateSelector = ({ date, setDate }: DateSelectorProps) => {
  const handlePrevDay = () => setDate(subDays(date, 1));
  const handleNextDay = () => setDate(addDays(date, 1));
  const handleResetToToday = () => setDate(new Date());

  return (
    <div className="relative bg-gray-50 rounded-md p-5 px-6">
  {/* 이전 / 날짜 / 다음 */}
  <div className="flex justify-center items-center gap-32">
    <Button variant="icon" onClick={handlePrevDay}>
      <ChevronLeft className="w-5 h-5" />
    </Button>

    <div className="flex items-center gap-2 text-gray-900">
      <Calendar className="w-5 h-5" />
      <span className="font-medium">
        {format(date, "yyyy년 MM월 dd일 (EEEE)", { locale: ko })}
      </span>
    </div>

    <Button variant="icon" onClick={handleNextDay}>
      <ChevronRight className="w-5 h-5" />
    </Button>
  </div>

  {/* 오늘로 돌아가기 */}
  <div className="absolute top-1/2 right-6 -translate-y-1/2">
    <Button
      variant="icon"
      onClick={handleResetToToday}
      title="오늘 날짜로 돌아가기"
      className={isToday(date) ? "invisible" : ""}
    >
      <RotateCw className="w-4 h-4" />
    </Button>
  </div>
</div>


  );
};

export default DateSelector;

