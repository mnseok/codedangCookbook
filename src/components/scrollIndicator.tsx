'use client'

import { Progress } from '@/components/ui/progress'
import { useSidebar } from '@/components/ui/sidebar'
import { useEffect, useState } from 'react'

export default function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [headerHeight, setHeaderHeight] = useState(64)

  const { open } = useSidebar()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const header = document.querySelector('header')
    if (header) {
      setHeaderHeight(header.clientHeight)
    }

    const scrollContainer = document.querySelector('body')
    if (!scrollContainer) {
      console.warn('⚠️ 스크롤 컨테이너를 찾을 수 없습니다.')
      return
    }

    const updateScrollProgress = () => {
      const scrollY = scrollContainer.scrollTop
      const scrollHeight =
        scrollContainer.scrollHeight - scrollContainer.clientHeight

      if (scrollHeight === 0) return
      if (scrollY > scrollHeight) return setScrollProgress(100)

      const progress = (scrollY / scrollHeight) * 100
      setScrollProgress(progress)
    }

    scrollContainer.addEventListener('scroll', updateScrollProgress)

    return () => {
      scrollContainer.removeEventListener('scroll', updateScrollProgress)
    }
  }, [])

  return (
    <div
      className={`fixed left-0 z-50`} // ✅ 처음 로딩 시 transition 없음
      style={{
        top: `${headerHeight}px`,
        width: open ? 'calc(100% - 16rem)' : '100%', // ✅ Sidebar 열림/닫힘에 따른 조정
        marginLeft: open ? '16rem' : '' // ✅ Sidebar 열림/닫힘에 따른 조정
      }}
    >
      <Progress value={scrollProgress} className="h-1" />
    </div>
  )
}
