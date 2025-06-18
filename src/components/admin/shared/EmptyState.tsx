interface EmptyStateProps {
  message: string;
  className?: string;
}

const EmptyState = ({ message, className = "" }: EmptyStateProps) => {
  return (
    <div
      className={`flex-1 flex items-center justify-center bg-white rounded-xl shadow ${className}`}
    >
      <p className='text-gray-500'>{message}</p>
    </div>
  );
};

export default EmptyState;
