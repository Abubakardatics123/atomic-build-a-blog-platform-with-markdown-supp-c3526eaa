import Link from 'next/link'

interface TagBadgeProps {
  tag: string
  count?: number
  active?: boolean
  size?: 'sm' | 'md'
}

export function TagBadge({ tag, count, active = false, size = 'sm' }: TagBadgeProps) {
  const baseClasses = size === 'sm'
    ? 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors'
    : 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-colors'

  const colorClasses = active
    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900'

  return (
    <Link href={'/tags/' + tag} className={baseClasses + ' ' + colorClasses}>
      <span>{'#' + tag}</span>
      {count !== undefined && (
        <span className={active ? 'text-indigo-200' : 'text-indigo-400 dark:text-indigo-500'}>
          {count}
        </span>
      )}
    </Link>
  )
}
