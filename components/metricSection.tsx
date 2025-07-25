type MetricSectionProps = {
  title: string;
  metrics: Record<string, string | number | null | undefined>;
};

export default function MetricSection({ title, metrics }: MetricSectionProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-md w-full max-w-md">
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <ul className="text-sm text-gray-300 space-y-1">
        {Object.entries(metrics).map(([label, value], idx) => (
          <li key={idx} className="flex justify-between">
            <span className="text-gray-400">{label}</span>
            <span className="font-semibold">
              {value !== null && value !== undefined ? value : "N/A"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
