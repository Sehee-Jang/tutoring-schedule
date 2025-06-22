import { useState } from "react";
import {
  ChevronDown,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Funnel,
} from "lucide-react"; // 아이콘
import Popover from "./Popover";

interface ColumnHeaderWithMenuProps {
  columnKey: string;
  label: string;
  filterOptions?: string[];
  onSortChange: (key: string, direction: "asc" | "desc") => void;
  onFilterChange: (key: string, values: string[]) => void;
  selectedFilters?: string[];
}

const ColumnHeaderWithMenu: React.FC<ColumnHeaderWithMenuProps> = ({
  columnKey,
  label,
  filterOptions = [],
  onSortChange,
  onFilterChange,
  selectedFilters = [],
}) => {
  const [open, setOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<string[]>(selectedFilters);

  const toggleOption = (value: string) => {
    setTempFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className='relative flex items-center gap-1'>
      <span>{label}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <div className='relative'>
          <Popover.Trigger>
            <ChevronDown className='w-4 h-4 text-gray-500 cursor-pointer' />
          </Popover.Trigger>

          {open && (
            <Popover.Content className=' mt-1 z-[9999] w-52 bg-white border rounded shadow text-sm'>
              {/* 정렬 메뉴 */}
              <div className='group relative hover:bg-gray-50 cursor-pointer flex items-center px-3 py-2'>
                <ArrowDownWideNarrow className='w-4 h-4 text-gray-500 mr-2' />
                <span>정렬</span>
                <div className='absolute left-full top-0 hidden group-hover:flex flex-col w-44 bg-white shadow border rounded ml-1 z-10'>
                  <button
                    className='px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2'
                    onClick={() => onSortChange(columnKey, "asc")}
                  >
                    <ArrowDownWideNarrow className='w-4 h-4 text-gray-500' />
                    오름차순
                  </button>
                  <button
                    className='px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2'
                    onClick={() => onSortChange(columnKey, "desc")}
                  >
                    <ArrowUpNarrowWide className='w-4 h-4 text-gray-500' />
                    내림차순
                  </button>
                </div>
              </div>

              {/* 필터 메뉴 */}
              <div className='group relative hover:bg-gray-50 cursor-pointer flex items-center px-3 py-2'>
                <Funnel className='w-4 h-4 text-gray-500 mr-2' />
                <span>필터</span>
                <div className='absolute left-full top-0 hidden group-hover:flex flex-col w-44 bg-white shadow border rounded ml-1 z-10 max-h-60 overflow-y-auto'>
                  {filterOptions.map((option) => (
                    <label
                      key={option}
                      className='flex items-center gap-2 px-3 py-1 hover:bg-gray-50 cursor-pointer'
                    >
                      <input
                        type='checkbox'
                        checked={tempFilters.includes(option)}
                        onChange={() => toggleOption(option)}
                      />
                      {option}
                    </label>
                  ))}
                  <button
                    className='w-full text-center text-blue-600 hover:underline text-sm mt-2 mb-2'
                    onClick={() => {
                      onFilterChange(columnKey, tempFilters);
                      setOpen(false);
                    }}
                  >
                    적용
                  </button>
                </div>
              </div>
            </Popover.Content>
          )}
        </div>
      </Popover>
    </div>
  );
};

export default ColumnHeaderWithMenu;
