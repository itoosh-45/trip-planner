
export interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  showValues?: boolean;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  formatValue?: (n: number) => string;
}

export default function ProgressBar({
  current,
  total,
  label,
  showPercentage = true,
  showValues = true,
  currency = '₪',
  size = 'md',
  formatValue,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  const isOverBudget = current > total;

  // same status scale as the budget summary: on track, near the limit, over
  const colorClass = isOverBudget ? 'bg-red-300' : percentage >= 85 ? 'bg-amber-300' : 'bg-green-300';

  const heightClass = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }[size];

  const displayCurrent = formatValue ? formatValue(current) : `${current.toLocaleString()} ${currency}`;
  const displayTotal = formatValue ? formatValue(total) : `${total.toLocaleString()} ${currency}`;

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-end mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-semibold text-gray-700">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`relative w-full bg-gray-100 rounded-full ${heightClass}`}>
        <div
          className={`wash absolute inset-y-0 right-0 rounded-full transition-[width] duration-700 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showValues && (
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>{displayCurrent}</span>
          <span>{displayTotal}</span>
        </div>
      )}
    </div>
  );
}
