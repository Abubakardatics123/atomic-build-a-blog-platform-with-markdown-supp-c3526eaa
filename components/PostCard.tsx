'use client'

import Link from 'next/link'
import { Calendar, Clock, ArrowRight, ArrowLeft, Check, Copy, ChevronDown } from 'lucide-react'
import { TagBadge } from './TagBadge'
import { formatDate } from '@/lib/posts'
import type { PostMeta } from '@/lib/posts'
import { useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import type { TableOfContentsItem } from '@/lib/mdx'

// ---- AuthorBio ----
interface AuthorBioProps {
  name: string
  bio: string
  avatar: string
}

export function AuthorBio({ name, bio, avatar }: AuthorBioProps) {
  return (
    <div className="flex items-start gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
      <img
        src={avatar}
        alt={name}
        className="w-14 h-14 rounded-full object-cover shrink-0 bg-indigo-100"
      />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 mb-1">
          Written by
        </p>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{bio}</p>
      </div>
    </div>
  )
}

// ---- PostNavigation ----
interface PostNavigationProps {
  prev: PostMeta | null
  next: PostMeta | null
}

export function PostNavigation({ prev, next }: PostNavigationProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
      {prev ? (
        <Link
          href={'/blog/' + prev.slug}
          className="group flex flex-col gap-1 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
        >
          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </span>
          <span className="font-medium text-slate-900 dark:text-slate-100 text-sm line-clamp-2 leading-snug">
            {prev.frontmatter.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={'/blog/' + next.slug}
          className="group flex flex-col gap-1 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors text-right"
        >
          <span className="flex items-center justify-end gap-1.5 text-xs text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            Next
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
          <span className="font-medium text-slate-900 dark:text-slate-100 text-sm line-clamp-2 leading-snug">
            {next.frontmatter.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}

// ---- TableOfContents ----
interface TableOfContentsProps {
  items: TableOfContentsItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('')
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-80px 0% -70% 0%' }
    )
    items.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <span>Table of Contents</span>
        <ChevronDown className={'w-4 h-4 text-slate-400 transition-transform ' + (collapsed ? '-rotate-90' : '')} />
      </button>
      {!collapsed && (
        <div className="px-4 pb-4">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.id} style={{ paddingLeft: (item.level - 1) * 12 + 'px' }}>
                <a
                  href={'#' + item.id}
                  onClick={(e) => {
                    e.preventDefault()
                    const el = document.getElementById(item.id)
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      window.history.pushState(null, '', '#' + item.id)
                    }
                  }}
                  className={
                    'block py-1 px-2 rounded text-sm transition-colors ' +
                    (activeId === item.id
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800')
                  }
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}

// ---- CopyBtn (internal) ----
function CopyBtn() {
  const [copied, setCopied] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const handleCopy = async () => {
    const pre = btnRef.current?.closest('.code-block')?.querySelector('pre')
    if (!pre) return
    const code = pre.textContent || ''
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }
  return (
    <button
      ref={btnRef}
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : 'Copy code'}
      className={
        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ' +
        (copied ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white')
      }
    >
      {copied ? (
        <><Check className="w-3.5 h-3.5" /><span>Copied!</span></>
      ) : (
        <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>
      )}
    </button>
  )
}

// ---- MarkdownRenderer ----
interface MarkdownRendererProps {
  html: string
}

export function MarkdownRenderer({ html }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const preElements = container.querySelectorAll('pre')
    const roots: ReturnType<typeof createRoot>[] = []
    preElements.forEach((pre) => {
      if (pre.parentElement?.classList.contains('code-block')) return
      const wrapper = document.createElement('div')
      wrapper.className = 'code-block relative group my-6'
      const btnContainer = document.createElement('div')
      btnContainer.className = 'absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity'
      pre.parentNode?.insertBefore(wrapper, pre)
      wrapper.appendChild(pre)
      wrapper.appendChild(btnContainer)
      const root = createRoot(btnContainer)
      root.render(<CopyBtn />)
      roots.push(root)
    })
    return () => {
      roots.forEach((root) => { try { root.unmount() } catch { /* ignore */ } })
    }
  }, [html])

  return (
    <div
      ref={containerRef}
      className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-bold prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-code:text-indigo-600 dark:prose-code:text-indigo-300 prose-code:bg-indigo-50 dark:prose-code:bg-indigo-950 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-img:rounded-xl prose-blockquote:border-indigo-400 prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

// ---- PostList ----
import { useMemo } from 'react'
import { SearchBar } from './SearchBar'
import { TagCloud } from './TagCloud'
import { Pagination } from './Pagination'

const POSTS_PER_PAGE = 6

interface PostListProps {
  posts: PostMeta[]
  tagCounts: Record<string, number>
  initialTag?: string
}

export function PostList({ posts, tagCounts, initialTag }: PostListProps) {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState(initialTag || '')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = posts
    if (activeTag) {
      result = result.filter((p) =>
        p.frontmatter.tags?.map((t) => t.toLowerCase()).includes(activeTag.toLowerCase())
      )
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.frontmatter.title.toLowerCase().includes(q) ||
          p.frontmatter.excerpt.toLowerCase().includes(q) ||
          p.frontmatter.tags?.some((t) => t.toLowerCase().includes(q))
      )
    }
    return result
  }, [posts, activeTag, search])

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)

  const handleSearch = (val: string) => { setSearch(val); setPage(1) }
  const handleTag = (tag: string) => { setActiveTag(activeTag === tag ? '' : tag); setPage(1) }

  const isFeaturedMode = page === 1 && !search && !activeTag

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <SearchBar value={search} onChange={handleSearch} />
        </div>
        {(activeTag || search) && (
          <div className="flex flex-wrap items-center gap-2 mb-5 text-sm text-slate-600 dark:text-slate-400">
            <span>Showing <strong className="text-slate-900 dark:text-slate-100">{filtered.length}</strong> result{filtered.length !== 1 ? 's' : ''}</span>
            {activeTag && (
              <button
                onClick={() => handleTag(activeTag)}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors"
              >
                {'#' + activeTag + ' ×'}
              </button>
            )}
          </div>
        )}
        {paginated.length > 0 ? (
          <>
            {isFeaturedMode && paginated[0] && (
              <div className="mb-6">
                <PostCard post={paginated[0]} featured />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {(isFeaturedMode ? paginated.slice(1) : paginated).map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No posts found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
      <aside className="lg:w-72 shrink-0">
        <div className="sticky top-24 space-y-6">
          <TagCloud tagCounts={tagCounts} activeTag={activeTag} />
          <div className="bg-indigo-50 dark:bg-indigo-950 rounded-xl border border-indigo-100 dark:border-indigo-900 p-5">
            <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 mb-2">About this blog</h3>
            <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
              Practical articles on web development, TypeScript, React, and building great software. Written by Alex Morgan.
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}

interface PostCardProps {
  post: PostMeta
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const { slug, frontmatter } = post

  if (featured) {
    return (
      <article className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100 dark:hover:shadow-indigo-950">
        {frontmatter.coverImage && (
          <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={frontmatter.coverImage}
              alt={frontmatter.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {frontmatter.tags?.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
            <Link href={'/blog/' + slug} className="stretched-link">
              {frontmatter.title}
            </Link>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-5 line-clamp-3">
            {frontmatter.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(frontmatter.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {frontmatter.readingTime} min read
              </span>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
              Read more <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:shadow-md p-6">
      <div className="flex flex-wrap gap-1.5 mb-3">
        {frontmatter.tags?.slice(0, 3).map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
      <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
        <Link href={'/blog/' + slug}>
          {frontmatter.title}
        </Link>
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
        {frontmatter.excerpt}
      </p>
      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(frontmatter.date)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {frontmatter.readingTime} min read
        </span>
      </div>
    </article>
  )
}
