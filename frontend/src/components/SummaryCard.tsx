import type { SummaryCardProps } from "../types/components";

export default function SummaryCard({
  title,
  value,
  unit,
  icon,
  bgColor,
  textColor,
}: SummaryCardProps) {
  return (
    <div className={`flex flex-col p-5 border-2 rounded-lg ${bgColor}`}>
      <h3 className="text-lg">
        {icon} {title}
      </h3>
      <p className={`mt-5 ml-1 text-4xl ${textColor}`}>
        {value} {unit}
      </p>
      <p className="mt-2 ml-1 text-gray-600">This month</p>
    </div>
  );
}
