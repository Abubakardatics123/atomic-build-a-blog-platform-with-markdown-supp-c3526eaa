import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface PostFrontmatter {
  title: string
  excerpt: string
  date: string
  author: string
  authorBio: string
  authorAvatar: string
  tags: string[]
  coverImage: string
  readingTime: number
}

export interface Post {
  slug: string
  frontmatter: PostFrontmatter
  content: string
}

export interface PostMeta {
  slug: string
  frontmatter: PostFrontmatter
}

function dirExists(): boolean {
  try {
    return fs.existsSync(postsDirectory)
  } catch {
    return false
  }
}

export function getAllPosts(): PostMeta[] {
  if (!dirExists()) return []

  const fileNames = fs.readdirSync(postsDirectory)
  const allPosts = fileNames
    .filter((f) => f.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)
      return {
        slug,
        frontmatter: matterResult.data as PostFrontmatter,
      }
    })

  return allPosts.sort((a, b) => {
    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  })
}

export function getPostBySlug(slug: string): Post | null {
  if (!dirExists()) return null
  try {
    const fullPath = path.join(postsDirectory, slug + '.md')
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    return {
      slug,
      frontmatter: matterResult.data as PostFrontmatter,
      content: matterResult.content,
    }
  } catch {
    return null
  }
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tagSet = new Set<string>()
  posts.forEach((post) => {
    if (post.frontmatter.tags) {
      post.frontmatter.tags.forEach((tag) => tagSet.add(tag))
    }
  })
  return Array.from(tagSet).sort()
}

export function getTagCounts(): Record<string, number> {
  const posts = getAllPosts()
  const counts: Record<string, number> = {}
  posts.forEach((post) => {
    if (post.frontmatter.tags) {
      post.frontmatter.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1
      })
    }
  })
  return counts
}

export function getPostsByTag(tag: string): PostMeta[] {
  const posts = getAllPosts()
  return posts.filter((post) => {
    if (!post.frontmatter.tags) return false
    return post.frontmatter.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  })
}

export function getAdjacentPosts(slug: string): { prev: PostMeta | null; next: PostMeta | null } {
  const posts = getAllPosts()
  const index = posts.findIndex((p) => p.slug === slug)
  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  }
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
