import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'

export interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight, { ignoreMissing: true } as object)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: { className: 'anchor-link' },
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown)

  return result.toString()
}

function slugify(text: string): string {
  let result = text.toLowerCase()
  result = result.split(' ').join('-')
  result = result.split('/').join('')
  result = result.split('.').join('')
  result = result.split(',').join('')
  result = result.split('(').join('')
  result = result.split(')').join('')
  result = result.split('?').join('')
  result = result.split('!').join('')
  result = result.split(':').join('')
  result = result.split('"').join('')
  result = result.split("'").join('')
  return result.trim()
}

export function extractTableOfContents(markdown: string): TableOfContentsItem[] {
  const lines = markdown.split('\n')
  const toc: TableOfContentsItem[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.startsWith('#')) continue
    const spaceIdx = line.indexOf(' ')
    if (spaceIdx < 1) continue
    const hashes = line.slice(0, spaceIdx)
    const level = hashes.length
    if (level > 3) continue
    const rawText = line.slice(spaceIdx + 1).trim()
    const text = rawText.split('*').join('').split('_').join('').split('`').join('').trim()
    const id = slugify(text)
    toc.push({ id, text, level })
  }

  return toc
}
