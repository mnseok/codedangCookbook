import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// ✅ Next.js 15+에서 사용 가능

type Heading = {
  id: string
  title: string
  level: number
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const pathname = usePathname() // ✅ 현재 URL 감지
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const header = document.querySelector('header')
    if (header) {
      setHeaderHeight(header.clientHeight)
    }

    const getHeadings = () => {
      const elements = Array.from(document.querySelectorAll('h2, h3')).map(
        (el) => ({
          id: el.id,
          title: (el as HTMLElement).innerText,
          level: el.tagName === 'H2' ? 2 : 3
        })
      )

      setHeadings(elements)
    }

    setTimeout(getHeadings, 100)
    return () => setHeadings([]) // 언마운트 시 초기화
  }, [pathname]) // ✅ URL 변경될 때 다시 실행

  useEffect(() => {
    if (headings.length === 0) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      let currentId: string | null = null

      for (const heading of headings) {
        const element = document.getElementById(heading.id)
        if (element && element.offsetTop - 100 <= scrollPosition) {
          currentId = heading.id
        }
      }

      setActiveId(currentId)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 초기 실행

    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  if (headings.length === 0) return null

  return (
    <aside
      className="sticky h-fit w-60 max-w-[20rem] min-w-[15rem] pt-5 hidden lg:flex"
      style={{ top: `${headerHeight === 0 ? 0 : headerHeight + 20}px` }}
    >
      {' '}
      <div className="w-full p-4">
        <div className="mb-3 text-lg font-semibold">ON THIS PAGE 📌</div>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`ml-${heading.level === 3 ? '6' : '0'}`}
            >
              <Link
                href={`#${heading.id}`}
                className={`hover:text-primary block transition ${
                  activeId === heading.id
                    ? 'text-primary font-bold'
                    : 'text-foreground'
                }`}
              >
                {heading.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
