import { ReactNode } from "react";

interface SettingsCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode; // 토글이나 버튼
  borderColor?: string;
}

const SettingsCard = ({
  title,
  description,
  icon,
  children,
  borderColor = "border-gray-200",
}: SettingsCardProps) => {
  return (
    <div
      className={`w-full max-w-2xl p-6 bg-white border ${borderColor} rounded-xl shadow-sm`}
    >
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center gap-2'>
          {icon}
          <h3 className='text-base font-semibold'>{title}</h3>
        </div>
        {children}
      </div>
      {description && <p className='text-sm text-gray-500'>{description}</p>}
    </div>
  );
};

export default SettingsCard;
