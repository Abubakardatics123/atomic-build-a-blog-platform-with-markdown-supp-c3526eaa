---
title: "React Performance Optimization Techniques"
excerpt: "Deep dive into React performance optimization: memoization with useMemo and useCallback, virtualization for long lists, code splitting, lazy loading, and profiling tools to identify bottlenecks."
date: "2024-04-01"
author: "Alex Morgan"
authorBio: "Full-stack developer and open-source enthusiast. Writes about web development, TypeScript, and building great user experiences."
authorAvatar: "/images/author-alex-morgan.jpg"
tags: ["react", "performance", "optimization", "advanced"]
coverImage: "/images/react-performance-optimization.jpg"
readingTime: 11
---

# React Performance Optimization Techniques

React is fast by default, but as your application grows, you may encounter performance bottlenecks. This guide covers the most effective techniques for optimizing React applications.

## Understanding React Rendering

Before optimizing, understand when React re-renders:

1. **State changes** — when `setState` or `useState` setter is called
2. **Props changes** — when parent passes new props
3. **Context changes** — when context value updates
4. **Parent re-renders** — when parent component re-renders

## React.memo for Component Memoization

`React.memo` prevents re-renders when props haven't changed:

```typescript
interface PostCardProps {
  title: string;
  excerpt: string;
  date: string;
}

// Without memo — re-renders on every parent render
function PostCard({ title, excerpt, date }: PostCardProps) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{excerpt}</p>
      <time>{date}</time>
    </div>
  );
}

// With memo — only re-renders when props change
const PostCard = React.memo(function PostCard({ title, excerpt, date }: PostCardProps) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{excerpt}</p>
      <time>{date}</time>
    </div>
  );
});
```

## useMemo and useCallback

```typescript
function SearchResults({ posts, query, onSelect }: Props) {
  // Memoize expensive computation
  const filteredPosts = useMemo(() => {
    return posts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [posts, query]); // Only recompute when posts or query changes

  // Memoize callback to prevent child re-renders
  const handleSelect = useCallback((id: string) => {
    onSelect(id);
  }, [onSelect]);

  return (
    <ul>
      {filteredPosts.map(post => (
        <PostItem key={post.id} post={post} onSelect={handleSelect} />
      ))}
    </ul>
  );
}
```

## Code Splitting with Dynamic Imports

Split your bundle to load code only when needed:

```typescript
import dynamic from 'next/dynamic';

// Load heavy component only when needed
const MarkdownEditor = dynamic(() => import('./MarkdownEditor'), {
  loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded" />,
  ssr: false, // Don't render on server
});

// Load based on condition
const AdminPanel = dynamic(() => import('./AdminPanel'));

function Dashboard({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div>
      <MainContent />
      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

## Virtualization for Long Lists

For lists with hundreds or thousands of items, use virtualization:

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualPostList({ posts }: { posts: Post[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated row height
  });

  return (
    <div ref={parentRef} className="h-screen overflow-auto">
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              height: virtualItem.size,
            }}
          >
            <PostCard post={posts[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Profiling with React DevTools

Use the React DevTools Profiler to identify bottlenecks:

1. Open React DevTools in Chrome/Firefox
2. Click the **Profiler** tab
3. Click **Record** and interact with your app
4. Stop recording and analyze the flame graph

Look for:
- Components that render too frequently
- Renders that take longer than 16ms (60fps threshold)
- Unnecessary re-renders (gray bars in the flame graph)

## Conclusion

Performance optimization is about measuring first, then optimizing. Don't prematurely optimize — use the React Profiler to identify actual bottlenecks, then apply the appropriate technique. The most impactful optimizations are usually:

1. Reducing unnecessary re-renders with `React.memo`
2. Code splitting large components
3. Virtualizing long lists
4. Memoizing expensive computations
