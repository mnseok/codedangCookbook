'use client'

import { Input } from '@/components/ui/input'
import { Search, Github } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import ThemeToggle from './themeToggle'
import { SidebarTrigger } from './ui/sidebar'

type FileTreeNode = {
  type: 'folder' | 'file'
  path: string
  title: string
  description: string
  icon: string
  url: string
}

export default function Header() {
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<FileTreeNode[]>([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (search.trim() === '') {
        setSearchResults([])
        setShowResults(false)
        return
      }

      try {
        const res = await fetch(`/api/search?keyword=${search}`)
        if (!res.ok) throw new Error('Failed to fetch search results')

        const data = await res.json()
        setSearchResults(data.results)
        setShowResults(true)
      } catch (error) {
        console.error('Search error:', error)
      }
    }

    const debounceTimer = setTimeout(fetchData, 300)
    return () => clearTimeout(debounceTimer)
  }, [search])

  return (
    <header className="bg-background text-foreground sticky top-0 flex w-full items-center justify-between gap-12 px-4 py-3 md:px-8">
      {/* Left: Logo & Sidebar Button */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <SidebarTrigger />
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Logo" width={36} height={36} />
        </Link>
      </div>

      {/* Center: Search Bar (Hidden on Mobile) */}
      <div className="relative w-full max-w-full flex-1 hidden sm:flex max-w-sm">
        <div className="flex w-full items-center space-x-2 rounded-lg border bg-gray-100 px-3 py-2 dark:bg-gray-800">
          <Search className="h-5 w-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            className="w-full border-none bg-transparent text-gray-700 focus:ring-0 focus:outline-none dark:text-gray-300"
          />
        </div>
        
        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="border-border bg-background absolute top-12 z-50 max-h-60 w-full overflow-y-auto rounded-lg border ">
            {searchResults.map((item, index) => (
              <Link
                key={index}
                href={`/docs/${item.url}`}
                className="hover:bg-sidebar-accent block px-4 py-3"
              >
                <p className="text-foreground text-sm font-bold">
                  {item.title}
                </p>
                <p className="text-muted text-xs">{item.description}</p>
              </Link>
            ))}
          </div>
        )}{' '}
      </div>

      {/* Right: GitHub & Theme Toggle */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <a
          href="https://github.com/skkuding"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <Github className="group-hover:text-primary dark:group-hover:text-primary h-5 w-5 text-gray-600 md:h-6 md:w-6 dark:text-gray-300" />
        </a>
        <ThemeToggle />
      </div>
    </header>
  )
}
