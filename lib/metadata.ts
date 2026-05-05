import type { Metadata } from 'next'
import type { PostFrontmatter } from './posts'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://devblog.example.com'
const siteName = 'DevBlog'
const siteDescription = 'A blog about web development, TypeScript, React, and modern software engineering.'

export function buildPostMetadata(slug: string, frontmatter: PostFrontmatter): Metadata {
  const ogImages = frontmatter.coverImage
    ? [{ url: frontmatter.coverImage, width: 1200, height: 630, alt: frontmatter.title }]
    : []

  return {
    title: frontmatter.title + ' | ' + siteName,
    description: frontmatter.excerpt,
    authors: [{ name: frontmatter.author }],
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.excerpt,
      url: siteUrl + '/blog/' + slug,
      siteName,
      images: ogImages,
      type: 'article',
      publishedTime: frontmatter.date,
      authors: [frontmatter.author],
      tags: frontmatter.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.excerpt,
      images: frontmatter.coverImage ? [frontmatter.coverImage] : [],
    },
  }
}

export function buildTagMetadata(tag: string, postCount: number): Metadata {
  const plural = postCount !== 1 ? 's' : ''
  return {
    title: '#' + tag + ' — ' + postCount + ' post' + plural + ' | ' + siteName,
    description: 'Browse all ' + postCount + ' post' + plural + ' tagged with "' + tag + '" on ' + siteName + '.',
    openGraph: {
      title: 'Posts tagged "' + tag + '"',
      description: 'Browse all posts tagged with "' + tag + '" on ' + siteName + '.',
      url: siteUrl + '/tags/' + tag,
      siteName,
      type: 'website',
    },
  }
}

export function buildHomeMetadata(): Metadata {
  return {
    title: siteName + ' — Web Development Articles & Tutorials',
    description: siteDescription,
    openGraph: {
      title: siteName,
      description: siteDescription,
      url: siteUrl,
      siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: siteDescription,
    },
  }
}

export function buildAboutMetadata(): Metadata {
  return {
    title: 'About | ' + siteName,
    description: 'Learn about ' + siteName + ' and the author behind the articles.',
    openGraph: {
      title: 'About ' + siteName,
      description: 'Learn about ' + siteName + ' and the author behind the articles.',
      url: siteUrl + '/about',
      siteName,
      type: 'profile',
    },
  }
}
