import { cn } from '../../lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Avatar({ src, alt = '', name, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || ''}
        className={cn('rounded-full object-cover', sizeClasses[size], className)}
      />
    );
  }

  const initials = name ? getInitials(name) : '?';

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-primary/10 font-medium text-primary',
        sizeClasses[size],
        className,
      )}
    >
      {initials}
    </div>
  );
}
