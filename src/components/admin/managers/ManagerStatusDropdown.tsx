import { UserStatus } from "../../../types/user";
import React, { useState } from "react";

interface ManagerStatusDropdownProps {
  currentStatus: UserStatus;
  onChange: (newStatus: UserStatus) => void;
}

const ManagerStatusDropdown: React.FC<ManagerStatusDropdownProps> = ({
  currentStatus,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  type StatusType = "pending" | "active" | "inactive";

  const colorMap: Record<StatusType, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    active: "bg-green-100 text-green-800",
    inactive: "bg-red-100 text-red-800",
  };

  const labelMap: Record<UserStatus, string> = {
    pending: "승인 대기",
    active: "활성",
    inactive: "비활성",
  };

  const availableOptions: Record<StatusType, UserStatus[]> = {
    pending: ["active", "inactive"],
    active: ["pending", "inactive"],
    inactive: ["active", "pending"],
  };

  return (
    <div className='relative inline-block text-left'>
      <button
        className={`px-2 py-1 text-xs rounded-full font-semibold ${colorMap[currentStatus]} focus:outline-none`}
        onClick={() => setOpen(!open)}
      >
        {labelMap[currentStatus]}
      </button>

      {open && (
        <div className='absolute mt-1 w-28 bg-white border rounded shadow z-10'>
          {availableOptions[currentStatus as StatusType].map((status) => (
            <button
              key={status}
              className='block w-full px-3 py-1 text-sm text-left hover:bg-gray-100'
              onClick={() => {
                onChange(status);
                setOpen(false);
              }}
            >
              {labelMap[status]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerStatusDropdown;
