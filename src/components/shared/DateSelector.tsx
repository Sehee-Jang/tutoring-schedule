import { addDays, format, isToday, subDays } from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  RotateCw,
} from "lucide-react";
import { Calendar } from "../ui/calendar";
import Popover from "./Popover";
import Button from "./Button";

interface DateSelectorProps {
  date: Date;
  setDate: (newDate: Date) => void;
}

const DateSelector = ({ date, setDate }: DateSelectorProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handlePrevDay = () => setDate(subDays(date, 1));
  const handleNextDay = () => setDate(addDays(date, 1));
  const handleResetToToday = () => setDate(new Date());

  const handleCalendarSelect = (newDate?: Date) => {
    if (!newDate) return;

    const normalizedDate = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate()
    );

    setDate(normalizedDate);
    setIsCalendarOpen(false);
  };

  return (
    <div className='relative rounded-md bg-gray-50 p-5 px-6'>
      {/* 이전 / 날짜 / 다음 */}
      <div className='flex items-center justify-center gap-28 sm:gap-32'>
        <Button variant='icon' onClick={handlePrevDay}>
          <ChevronLeft className='h-5 w-5' />
        </Button>

        <div className='flex items-center gap-3 text-gray-900'>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <Popover.Trigger>
              <div
                className='flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-blue-500 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                role='button'
                tabIndex={0}
                aria-label='날짜 선택'
                aria-expanded={isCalendarOpen}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " " ||
                    event.key === "Spacebar"
                  ) {
                    event.preventDefault();
                    setIsCalendarOpen((prev) => !prev);
                  }
                }}
              >
                <CalendarIcon className='h-5 w-5' />
              </div>
            </Popover.Trigger>
            <Popover.Content className='mt-2 rounded-lg border border-gray-200 bg-white p-0 shadow-xl'>
              <Calendar
                mode='single'
                selected={date}
                onSelect={handleCalendarSelect}
                initialFocus
              />
            </Popover.Content>
          </Popover>

          <span className='font-medium'>
            {format(date, "yyyy년 MM월 dd일 (EEEE)", { locale: ko })}
          </span>
        </div>

        <Button variant='icon' onClick={handleNextDay}>
          <ChevronRight className='h-5 w-5' />
        </Button>
      </div>

      {/* 오늘로 돌아가기 */}
      <div className='absolute right-6 top-1/2 -translate-y-1/2'>
        <Button
          variant='icon'
          onClick={handleResetToToday}
          title='오늘 날짜로 돌아가기'
          className={isToday(date) ? "invisible" : ""}
        >
          <RotateCw className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};

export default DateSelector;
