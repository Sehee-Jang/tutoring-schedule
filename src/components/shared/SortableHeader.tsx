import { SortDirection } from "../../types/sort";
import { ChevronDown, ChevronUp, Minus } from "lucide-react";

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: {
    key: string;
    direction: SortDirection;
  };
  onSortChange: (key: string) => void;
}

const SortableHeader = ({
  label,
  sortKey,
  currentSort,
  onSortChange,
}: SortableHeaderProps) => {
  const isActive = currentSort.key === sortKey;
  const direction = isActive ? currentSort.direction : null;

  const getIcon = () => {
    if (direction === "asc") return <ChevronUp size={16} />;
    if (direction === "desc") return <ChevronDown size={16} />;
    return <Minus size={16} />;
  };

  return (
    <button
      className='flex items-center gap-1 group hover:text-black'
      onClick={() => onSortChange(sortKey)}
      type='button'
    >
      <span>{label}</span>
      <span className='text-gray-400 group-hover:text-gray-600'>
        {getIcon()}
      </span>
    </button>
  );
};

export default SortableHeader;
