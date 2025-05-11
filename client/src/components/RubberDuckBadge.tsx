interface RubberDuckBadgeProps {
  className?: string;
}

export function RubberDuckBadge({ className = "" }: RubberDuckBadgeProps) {
  return (
    <span
      className={`bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full ${className}`}
    >
      Rubber Duck
    </span>
  );
}
