import { searchMarkdownFiles } from '@/lib/searchMarkdown'
import { NextResponse } from 'next/server'
import path from 'path'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const keyword = searchParams.get('keyword')

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword is required' }, { status: 400 })
  }

  const markdownDir = path.join(process.cwd(), '/public/docs')
  const results = searchMarkdownFiles(keyword, markdownDir)

  return NextResponse.json({ results })
}
