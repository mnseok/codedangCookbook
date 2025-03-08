import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb'
import { Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          segment = segment.replace(/-/g, ' ')
          const href = '/' + pathSegments.slice(0, index + 1).join('/')
          const isHome = index === 0 // 홈 여부
          const isLast = index === pathSegments.length - 1

          return (
            <BreadcrumbItem key={href}>
              {!isLast || isHome ? (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={href} className={!isLast ? 'text-primary' : ''}>
                      {isHome ? (
                        <Home className="inline-block h-5 w-5" />
                      ) : (
                        decodeURIComponent(segment)
                      )}
                    </Link>
                  </BreadcrumbLink>
                  {!isLast && <BreadcrumbSeparator />}
                </>
              ) : (
                <BreadcrumbPage>{decodeURIComponent(segment)}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
