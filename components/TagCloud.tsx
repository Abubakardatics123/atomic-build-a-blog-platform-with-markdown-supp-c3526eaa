import { TagBadge } from './TagBadge'

interface TagCloudProps {
  tagCounts: Record<string, number>
  activeTag?: string
}

export function TagCloud({ tagCounts, activeTag }: TagCloudProps) {
  const tags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wide">
        Browse by Topic
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(([tag, count]) => (
          <TagBadge
            key={tag}
            tag={tag}
            count={count}
            active={activeTag === tag}
            size="md"
          />
        ))}
      </div>
    </div>
  )
}

// NOTE: app/ directory files are co-located below as named exports
// for reference — actual app files must be created at app/*.tsx paths.
// This file is components/TagCloud.tsx only.
