'use client'

import { FileTreeNode } from '@/app/api/docs/route'
import { AppSidebar } from '@/components/appSidebar'
import { DynamicBreadcrumb } from '@/components/dynamicBreadcrumb'
import Header from '@/components/header'
import { Icons } from '@/components/icons'
import ScrollIndicator from '@/components/scrollIndicator'
import TableOfContents from '@/components/tableOfContents'
import { SidebarProvider } from '@/components/ui/sidebar'
import matter from 'gray-matter'
import { ArrowLeft, ArrowRight, ExternalLink, Folder } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

export default function DocsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [fileTree, setFileTree] = useState<FileTreeNode[]>([])
  const [current, setCurrent] = useState<FileTreeNode | null>(null)
  const [markdownContent, setMarkdownContent] = useState<string | null>('')
  const [prev, setPrev] = useState<FileTreeNode | null>(null)
  const [next, setNext] = useState<FileTreeNode | null>(null)

  const pathname = usePathname()
  const currentPath = pathname.replace('/docs', '').replace(/^\//, '')

  useEffect(() => {
    async function fetchCurrentInfo() {
      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/docs/current?path=\"${encodeURIComponent(currentPath)}\"`
        )
        if (!response.ok) throw new Error('Failed to fetch current info')

        const data = await response.json()

        setCurrent(data)

        if (data.type === 'file') {
          await fetchMarkdownContent(data.path)
          fetchPrevNext()
        } else {
          fetchFileTree()
        }
      } catch (error) {
        console.error('Error fetching current info:', error)
        setCurrent(null)
      } finally {
        setIsLoading(false)
      }
    }

    async function fetchFileTree() {
      try {
        const response = await fetch(
          `/api/docs?path=\"${encodeURIComponent(currentPath)}\"`
        )
        if (!response.ok) throw new Error('Failed to fetch file tree')

        const data = await response.json()

        setFileTree(data)
      } catch (error) {
        console.error('Error fetching file tree:', error)
        setFileTree([])
      }
    }

    async function fetchPrevNext() {
      try {
        const url = currentPath.split('/').slice(0, -1).join('/')
        const response = await fetch(
          `/api/docs?path=\"${encodeURIComponent(url)}\"`
        )
        if (!response.ok) throw new Error('Failed to fetch prev/next')

        const data = await response.json()

        const currentIndex = data.findIndex(
          (item: FileTreeNode) => item.url?.replace('docs/', '') === currentPath
        )
        if (currentIndex === -1)
          throw new Error('Current item not found in file tree')

        setPrev(data[currentIndex - 1] || null)
        setNext(data[currentIndex + 1] || null)
      } catch (error) {
        console.error('Error fetching prev/next:', error)
        setPrev(null)
        setNext(null)
      }
    }

    fetchCurrentInfo()
  }, [currentPath])

  const fetchMarkdownContent = async (path: string) => {
    try {
      const response = await fetch(
        `/api/docs/content?path=${encodeURIComponent(path)}`
      )
      if (!response.ok) throw new Error('Markdown file not found')

      const text = await response.text()
      const { content } = matter(text)

      setMarkdownContent(content)
    } catch (error) {
      console.error('Error fetching markdown content:', error)
      setMarkdownContent('## Error: Markdown content not found.')
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-grow flex-col">
        <Header />
        <div className="flex min-h-screen flex-col">
          <div className="bg-background text-foreground mx-auto min-h-screen">
            {/* ✅ 로딩 중일 때는 로딩 화면만 표시하고, 컨텐츠 숨김 */}
            {isLoading ? (
              <div className="flex h-screen w-full items-center justify-center">
                <div className="border-primary h-16 w-16 animate-spin rounded-full border-b-4"></div>
              </div>
            ) : (
              <>
                {current?.type === 'file' ? (
                  <div className="flex flex-row">
                    <ScrollIndicator />
                    {/* 왼쪽 content */}
                    <div className="px-4 pt-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
                      <DynamicBreadcrumb />
                      <h1 className="mt-4 mb-6 text-3xl font-bold">
                        {`${current?.title}`}
                      </h1>
                      <div className="prose prose-neutral dark:prose-invert mx-auto w-full max-w-none px-4 sm:px-6 lg:px-8">
                        {markdownContent ? (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[
                              rehypeSlug,
                              [
                                rehypeAutolinkHeadings,
                                {
                                  properties: { className: ['anchor'] }
                                }
                              ]
                            ]}
                            components={{
                              img: ({ src, alt }) => {
                                if (!src) return null
                                return (
                                  <Image
                                    src={
                                      src.startsWith('http')
                                        ? src
                                        : `/docs/${currentPath}/${src}`
                                    }
                                    alt={alt || 'Image'}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="h-auto w-full"
                                  />
                                )
                              },
                              a: ({ href, children }) => {
                                const isExternal = href?.startsWith('http')
                                return (
                                  <Link
                                    href={href || '#'}
                                    className="text-primary inline-flex items-center font-bold no-underline transition-all duration-200 hover:text-blue-600"
                                    target={isExternal ? '_blank' : '_self'}
                                    rel={
                                      isExternal ? 'noopener noreferrer' : ''
                                    }
                                  >
                                    {children}
                                    {isExternal && (
                                      <ExternalLink className="ml-1 h-4 w-4" />
                                    )}
                                  </Link>
                                )
                              }
                            }}
                          >
                            {
                              markdownContent
                                .replace(/<!--.*?-->/g, '') // HTML 주석 제거
                                .replace(/%20/g, '-') // 공백 문자 치환
                                .replace(/\(\.?\/?([^()\s]+)\.md\)/g, '($1)') // Markdown 내부 링크에서 .md 확장자 제거
                                .replace(/\(<\.?\/?([^()\s]+)\.md>\)/g, '($1)') // HTML 스타일 링크에서 .md 확장자 제거
                                .replace(
                                  /{{<\s*figure\s+src="([^"]+)"(?:\s+alt="([^"]*)")?\s*>}}/g,
                                  (_, src, alt) =>
                                    `![${alt || 'Image'}](${src})`
                                ) // Hugo figure 변환 (alt 속성 없을 경우 'Image' 기본값)
                                .replace(
                                  /<p\s+align="center">\s*<img\s+src="([^"]+)"\s+(?:width="\d+"\s*)?>\s*<\/p>/g,
                                  '![]($1)'
                                ) // HTML <img>을 Markdown 이미지로 변환
                                .replace(
                                  /<img\s+src="([^"]+)"\s+alt="([^"]*)"\s*(?:width="\d+"\s*)?>/g,
                                  '![$2]($1)'
                                ) // 일반적인 <img> 태그 변환
                                .replace(
                                  /<img\s+src="([^"]+)"\s*(?:width="\d+"\s*)?>/g,
                                  '![]($1)'
                                ) // alt 속성이 없는 <img> 태그도 변환
                            }
                          </ReactMarkdown>
                        ) : (
                          <p className="text-gray-500">
                            📄 Markdown content is loading...
                          </p>
                        )}
                      </div>
                      {/* ✅ prev & next 네비게이션 유지 */}
                      <div className="flex justify-between py-10">
                        {prev ? (
                          <Link
                            href={`/${prev.url}`}
                            className="border-primary text-primary hover:bg-primary flex items-center gap-3 rounded-lg border px-4 py-2 no-underline transition-all duration-300 ease-in-out hover:text-white"
                          >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="font-semibold">{prev.title}</span>
                          </Link>
                        ) : (
                          <div />
                        )}
                        {next ? (
                          <Link
                            href={`/${next.url}`}
                            className="border-primary text-primary hover:bg-primary flex items-center gap-3 rounded-lg border px-4 py-2 no-underline transition-all duration-300 ease-in-out hover:text-white"
                          >
                            <span className="font-semibold">{next.title}</span>
                            <ArrowRight className="h-5 w-5" />
                          </Link>
                        ) : (
                          <div />
                        )}
                      </div>
                    </div>
                    <TableOfContents />
                  </div>
                ) : (
                  <div className="max-w-none px-2 pt-6 sm:px-4 md:px-6 lg:px-8 xl:px-12">
                    <DynamicBreadcrumb />
                    <h1 className="mt-4 mb-6 text-3xl font-bold">
                      {`${current?.title}`}
                    </h1>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {fileTree.map((item) => {
                        const IconComponent =
                          Icons[item.icon as keyof typeof Icons]

                        return (
                          <Link
                            href={`/${item.url}`}
                            key={item.title}
                            className="group bg-background hover:bg-primary relative rounded border p-6 shadow-sm transition-colors duration-500 ease-out hover:border-transparent hover:text-white"
                          >
                            <div className="mb-3 flex items-center justify-between">
                              {IconComponent && (
                                <IconComponent className="text-primary h-6 w-6 transition-colors duration-300 ease-out group-hover:text-white" />
                              )}
                              {item.type === 'folder' && (
                                <div className="h-6 w-6 rounded-md">
                                  <Folder />
                                </div>
                              )}
                            </div>

                            <h2 className="pt-5 text-xl font-semibold transition-colors duration-300 ease-out group-hover:text-white">
                              {item.title || item.title}
                            </h2>

                            <p className="text-gray-500 transition-colors duration-300 ease-out group-hover:text-gray-300">
                              {item.description}
                            </p>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
