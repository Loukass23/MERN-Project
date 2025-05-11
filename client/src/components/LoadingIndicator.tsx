interface LoadingIndicatorProps {
  text?: string;
  className?: string;
}

export function LoadingIndicator({
  text = "Loading...",
  className = "",
}: LoadingIndicatorProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="inline-block animate-bounce text-4xl">🦆</div>
      <p className="mt-4 text-blue-800">{text}</p>
    </div>
  );
}
