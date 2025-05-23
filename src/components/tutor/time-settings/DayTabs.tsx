interface DayTabsProps {
  selectedDay: string;
  onChange: (day: string) => void;
}

const DayTabs = ({ selectedDay, onChange }: DayTabsProps) => {
  const days = [
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
    "일요일",
  ];

  return (
    <div className='flex w-full items-center justify-between border-b'>
      {days.map((day) => (
        <button
          key={day}
          className={`flex-1 text-center px-3 py-2 ${
            selectedDay === day
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => onChange(day)}
        >
          {day}
        </button>
      ))}
    </div>
  );
};

export default DayTabs;
