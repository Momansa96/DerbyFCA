import React from 'react';

interface ContributionProgressBarProps {
  weeksPaid: number;
  weeksElapsed: number;
  showLabel?: boolean;
}

export default function ContributionProgressBar({
  weeksPaid,
  weeksElapsed,
  showLabel = true
}: ContributionProgressBarProps) {
  const percentage = Math.min((weeksPaid / weeksElapsed) * 100, 100);
  const isUpToDate = weeksPaid >= weeksElapsed;
  const isAhead = weeksPaid > weeksElapsed;

  const getColor = () => {
    if (isAhead) return 'bg-blue-500';
    if (isUpToDate) return 'bg-green-500';
    if (percentage >= 75) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>{weeksPaid} / {weeksElapsed} semaines</span>
          <span className="font-semibold">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}