/**
 * CircularProgress — SVG-based circular progress bar
 * Used in the Insights section for Savings Progress.
 */

interface CircularProgressProps {
    value: number;       // 0-100
    size?: number;       // Diameter in px
    strokeWidth?: number;
    label?: string;
    color?: string;
}

export default function CircularProgress({
    value,
    size = 120,
    strokeWidth = 10,
    label,
    color = '#bdf75c',
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-gray-soft dark:text-dark-border"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                {/* Center label */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-navy dark:text-light">
                        {Math.round(value)}%
                    </span>
                </div>
            </div>
            {label && (
                <span className="text-sm font-medium text-navy/60 dark:text-light/60">
                    {label}
                </span>
            )}
        </div>
    );
}
