interface BadgeProps {
  status: string;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  let colorClass = "bg-gray-100 text-gray-800";
  let label = "알 수 없음";

  if (status === "active") {
    colorClass = "bg-green-100 text-green-800";
    label = "활성";
  } else if (status === "inactive") {
    colorClass = "bg-red-100 text-red-800";
    label = "비활성";
  } else if (status === "pending") {
    colorClass = "bg-yellow-100 text-yellow-800";
    label = "승인 대기";
  }

  return (
    <span
      className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${colorClass}`}
    >
      {label}
    </span>
  );
};
