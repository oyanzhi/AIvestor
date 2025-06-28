
type LoadingIndicatorProps = {
  text?: string;
  size?: number;
  color?: string;
};

export default function LoadingIndicator({ text = "Loading...", size = 16, color = "white" }: LoadingIndicatorProps) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div
        className="animate-spin rounded-full border-2 border-t-transparent"
        style={{ width: size, height: size, borderColor: color }}
      />
      <span className="text-white">{text}</span>
    </div>
  );
}