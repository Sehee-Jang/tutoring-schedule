interface TimeRangeControlsProps {
  startTime: string;
  endTime: string;
  interval: number;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onIntervalChange: (value: number) => void;
}

const TimeRangeControls = ({
  startTime,
  endTime,
  interval,
  onStartTimeChange,
  onEndTimeChange,
  onIntervalChange,
}: TimeRangeControlsProps) => {
  return (
    <div className='flex justify-between items-center mt-4 px-6'>
      <div className='flex items-center space-x-4'>
        <label>시간 설정:</label>
        <input
          type='time'
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
          className='border px-2 py-1 rounded'
        />
        <span>~</span>
        <input
          type='time'
          value={endTime}
          onChange={(e) => onEndTimeChange(e.target.value)}
          className='border px-2 py-1 rounded'
        />
      </div>
      <div className='flex items-center space-x-2'>
        <label>간격(분):</label>
        <input
          type='number'
          value={interval}
          onChange={(e) => onIntervalChange(Number(e.target.value))}
          min='5'
          max='120'
          step='5'
          className='border px-2 py-1 rounded w-20'
        />
      </div>
    </div>
  );
};

export default TimeRangeControls;
