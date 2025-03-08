'use client'

import { FileTreeNode } from '@/app/api/docs/route'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Icons } from './icons'

export function AppSidebar() {
  const [fileTree, setFileTree] = useState<FileTreeNode[]>([])
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({})
  const pathname = usePathname()

  useEffect(() => {
    async function fetchFileTree() {
      const response = await fetch('/api/docs')
      const data = await response.json()
      setFileTree(data)
    }
    fetchFileTree()
  }, [])

  useEffect(() => {
    if (fileTree.length > 0) {
      autoOpenFolders(fileTree, pathname)
    }
  }, [pathname, fileTree])

  const autoOpenFolders = (nodes: FileTreeNode[], path: string) => {
    const newOpenFolders: Record<string, boolean> = {}
    const traverse = (items: FileTreeNode[]) => {
      for (const item of items) {
        if (path.includes(item.url)) {
          newOpenFolders[item.url] = true
        }
        if (item.children) {
          traverse(item.children)
        }
      }
    }
    traverse(nodes)
    setOpenFolders(newOpenFolders)
  }

  const toggleFolder = (folderPath: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }))
  }

  const renderTree = (nodes: FileTreeNode[]) => {
    return nodes.map((node) => {
      const isActive = pathname === `/${node.url}`
      const IconComponent = Icons[node.icon as keyof typeof Icons]

      if (node.type === 'folder') {
        return (
          <SidebarGroup key={node.url} className="pl-4">
            <SidebarGroupLabel
              className={`mb-2 flex cursor-pointer items-center justify-between gap-2 rounded p-4 transition hover:bg-[var(--sidebar-accent)]/10 hover:text-[var(--sidebar-text)]`}
              onClick={() => toggleFolder(node.url)}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[var(--sidebar-primary)]/10">
                  {IconComponent && (
                    <IconComponent
                      className={`h-4 w-4 ${openFolders[node.url] ? 'text-[var(--sidebar-primary)]' : 'text-[var(--sidebar-text)]'}`}
                    />
                  )}
                </div>
                <span
                  className={`text-base font-bold ${openFolders[node.url] ? 'text-[var(--sidebar-primary)]' : 'text-[var(--sidebar-text)]'}`}
                >
                  {node.title}
                </span>
              </div>
              {openFolders[node.url] ? (
                <ChevronDown className="h-4 w-4 text-[var(--sidebar-primary)]" />
              ) : (
                <ChevronRight className="h-4 w-4 text-[var(--sidebar-text)]/70" />
              )}
            </SidebarGroupLabel>
            {openFolders[node.url] && (
              <SidebarGroupContent className="ml-6">
                {renderTree(node.children || [])}
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        )
      } else {
        return (
          <SidebarMenuItem
            key={node.url}
            className={`mb-1 rounded transition ${isActive ? 'border-l-4 border-[var(--sidebar-primary)] bg-[var(--sidebar-primary)]/10 font-semibold text-[var(--sidebar-primary)]' : ''}`}
          >
            <SidebarMenuButton asChild>
              <a
                href={`/${node.url}`}
                className={`flex items-center gap-3 rounded p-2 ${
                  isActive
                    ? 'border-l-4 border-[var(--sidebar-primary)] bg-[var(--sidebar-primary)]/10 font-semibold text-[var(--sidebar-primary)] hover:bg-transparent'
                    : ''
                }`}
              >
                <span>- {node.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      }
    })
  }

  return (
    <Sidebar className="mx-0 w-64 border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] p-0 shadow-md">
      <SidebarContent className="pt-8">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderTree(fileTree)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
