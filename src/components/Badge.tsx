import { cn } from '@/lib/utils';

interface BadgeProps {
  category: string;
  color: string;
}

export function Badge({ category, color }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      color
    )}>
      {category}
    </span>
  );
}