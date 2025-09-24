import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "../../lib/utils";

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

interface CalendarProps {
  mode?: "single";
  selected?: Date;
  onSelect?: (date?: Date) => void;
  initialFocus?: boolean;
  showOutsideDays?: boolean;
  className?: string;
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  showOutsideDays = true,
  className,
}: CalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState<Date>(() =>
    selected
      ? new Date(selected.getFullYear(), selected.getMonth(), 1)
      : new Date()
  );

  useEffect(() => {
    if (!selected) return;
    setVisibleMonth((current) => {
      if (
        current.getFullYear() === selected.getFullYear() &&
        current.getMonth() === selected.getMonth()
      ) {
        return current;
      }

      return new Date(selected.getFullYear(), selected.getMonth(), 1);
    });
  }, [selected]);

  const daysInMonth = useMemo(() => {
    const start = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [visibleMonth]);

  const weeks = useMemo(() => {
    const chunked: Date[][] = [];
    for (let i = 0; i < daysInMonth.length; i += 7) {
      chunked.push(daysInMonth.slice(i, i + 7));
    }
    return chunked;
  }, [daysInMonth]);

  const handleSelect = (date: Date) => {
    if (mode !== "single") return;
    onSelect?.(date);
  };

  return (
    <div className={cn("w-[272px] select-none p-3", className)}>
      <div className='relative flex items-center justify-center pb-2'>
        <button
          type='button'
          className='absolute left-1 flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
          onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
          aria-label='이전 달'
        >
          <ChevronLeft className='h-4 w-4' />
        </button>
        <div className='text-sm font-semibold text-gray-800'>
          {format(visibleMonth, "yyyy년 MM월", { locale: ko })}
        </div>
        <button
          type='button'
          className='absolute right-1 flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
          onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
          aria-label='다음 달'
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>

      <div className='mb-2 grid grid-cols-7 text-center text-[0.8rem] font-medium text-gray-500'>
        {WEEK_DAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className='space-y-1'>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className='grid grid-cols-7 gap-1'>
            {week.map((day) => {
              const isOutside = !isSameMonth(day, visibleMonth);
              if (isOutside && !showOutsideDays) {
                return <div key={day.toISOString()} />;
              }

              const isSelected = selected ? isSameDay(day, selected) : false;
              const isCurrent = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  type='button'
                  className={cn(
                    "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                    isOutside
                      ? "text-gray-400 opacity-60"
                      : "text-gray-700 hover:bg-blue-50",
                    isCurrent && !isSelected
                      ? "border border-blue-400 text-blue-600"
                      : "",
                    isSelected ? "bg-blue-600 text-white hover:bg-blue-600" : ""
                  )}
                  onClick={() => handleSelect(day)}
                  aria-pressed={isSelected}
                  aria-label={format(day, "yyyy-MM-dd", { locale: ko })}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
