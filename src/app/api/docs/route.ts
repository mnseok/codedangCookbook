import fs from 'fs'
import matter from 'gray-matter'
import { NextResponse } from 'next/server'
import path from 'path'

export type FileTreeNode = {
  type: 'folder' | 'file'
  path: string
  title: string
  description: string
  icon: string
  url: string
  children?: FileTreeNode[]
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const requestedPath = url.searchParams.get('path')?.replace(/"/g, '') || ''
  const docsDir = path.join(process.cwd(), 'public/docs')
  const fullRequestedPath = path.join(docsDir, requestedPath)

  if (fs.existsSync(fullRequestedPath + '.md')) {
    return NextResponse.json(
      { info: 'Markdown file found', ok: true },
      { status: 200 }
    )
  }
  if (
    !fs.existsSync(fullRequestedPath) ||
    !fs.statSync(fullRequestedPath).isDirectory()
  ) {
    return NextResponse.json({ error: 'Path not found' }, { status: 404 })
  }

  function getMetadataFromMarkdown(filePath: string) {
    if (!fs.existsSync(filePath))
      return { title: '', description: '', icon: 'article' }

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(fileContent)
      return {
        title: data.title || '',
        description: data.description || '',
        icon: data.icon || 'article'
      }
    } catch (error) {
      console.error(`Error reading markdown file: ${filePath}`, error)
      return { title: '', description: '', icon: 'article' }
    }
  }

  function getFileTree(dirPath: string, relativePath = ''): FileTreeNode[] {
    const fullPath = path.join(dirPath, relativePath)
    if (!fs.existsSync(fullPath)) return []

    const items = fs.readdirSync(fullPath, { withFileTypes: true })

    return items
      .filter(
        (item) => !['_index.md', 'assets', 'images', 'data'].includes(item.name)
      )
      .map((item) => {
        const itemPath = path.join(relativePath, item.name)
        const filePath = path.join(dirPath, itemPath)
        const url = path
          .join('docs', requestedPath, itemPath)
          .replace(/ /g, '-')

        if (item.isDirectory()) {
          const metadata = getMetadataFromMarkdown(
            path.join(filePath, '_index.md')
          )
          return {
            type: 'folder',
            path: itemPath,
            title: metadata.title || item.name,
            description: metadata.description || '',
            icon: metadata.icon || 'folder',
            url,
            children: getFileTree(dirPath, itemPath)
          }
        } else if (filePath.endsWith('.md')) {
          const metadata = getMetadataFromMarkdown(filePath)
          return {
            type: 'file',
            path: itemPath,
            title: metadata.title || item.name.replace('.md', ''),
            description: metadata.description || '',
            url: url.replace('.md', ''),
            icon: metadata.icon || 'article'
          }
        }
        return null
      })
      .filter((node) => node !== null) as FileTreeNode[]
  }

  const sortTree = (nodes: FileTreeNode[]): FileTreeNode[] => {
    if (!nodes || nodes.length === 0) return []

    return nodes
      .map((node) => ({
        ...node,
        children: node.children ? sortTree(node.children) : undefined
      }))
      .sort((a, b) => {
        if (a.type === 'folder' && b.type === 'file') return -1
        if (a.type === 'file' && b.type === 'folder') return 1

        if (a.title === 'Getting Started') return -1
        if (b.title === 'Getting Started') return 1

        return a.title.localeCompare(b.title)
      })
  }

  return NextResponse.json(sortTree(getFileTree(fullRequestedPath)))
}
