import { FileTreeNode } from '@/app/api/docs/route'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

export function searchMarkdownFiles(
  keyword: string,
  directory: string
): FileTreeNode[] {
  const result: FileTreeNode[] = []

  const safeKeyword = keyword.replace(/[.* +?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(safeKeyword, 'iu')

  function getMetadata(filePath: string) {
    if (!fs.existsSync(filePath))
      return { title: '', description: '', icon: 'article' }

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(fileContent)
      return {
        title: data.title?.trim() || '',
        description: data.description?.trim() || '',
        icon: data.icon || 'article'
      }
    } catch (error) {
      console.error(`Error reading markdown file: ${filePath}`, error)
      return { title: '', description: '', icon: 'article' }
    }
  }

  function searchInFile(filePath: string, relativePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8').trim()
    const metadata = getMetadata(filePath)

    if (
      (content && regex.test(content)) ||
      (metadata.title && regex.test(metadata.title)) ||
      (metadata.description && regex.test(metadata.description))
    ) {
      const url = relativePath.replace('.md', '').replace(/ /g, '-')

      result.push({
        type: 'file',
        path: relativePath,
        title: metadata.title,
        description: metadata.description || '',
        icon: metadata.icon || 'article',
        url
      })
    }
  }

  function searchDirectory(dir: string, relativePath = '') {
    if (!fs.existsSync(dir)) return

    const items = fs.readdirSync(dir, { withFileTypes: true })
    let folderMetadata: FileTreeNode | null = null

    items.forEach((item) => {
      const itemPath = path.join(relativePath, item.name)
      const fullPath = path.join(dir, item.name)
      const url = itemPath
        .replace('.md', '')
        .replace(/_index$/, '')
        .replace(/ /g, '-')

      if (item.isDirectory()) {
        searchDirectory(fullPath, itemPath)
      } else if (fullPath.endsWith('_index.md')) {
        const metadata = getMetadata(fullPath)

        if (
          metadata.title &&
          (regex.test(metadata.title) || regex.test(metadata.description))
        ) {
          folderMetadata = {
            type: 'folder',
            path: relativePath,
            title: metadata.title,
            description: metadata.description || '',
            icon: metadata.icon || 'folder',
            url
          }
        }
      } else if (fullPath.endsWith('.md')) {
        searchInFile(fullPath, itemPath)
      }
    })

    if (folderMetadata) {
      result.push(folderMetadata)
    }
  }

  searchDirectory(directory)
  return result
}
