"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FileTreeNode } from "@/app/api/docs/route";
import { Icons } from "./icons";

export function AppSidebar() {
  const [fileTree, setFileTree] = useState<FileTreeNode[]>([]);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  useEffect(() => {
    async function fetchFileTree() {
      const response = await fetch("/api/docs");
      const data = await response.json();
      setFileTree(data);
    }
    fetchFileTree();
  }, []);

  useEffect(() => {
    if (fileTree.length > 0) {
      autoOpenFolders(fileTree, pathname);
    }
  }, [pathname, fileTree]);

  const autoOpenFolders = (nodes: FileTreeNode[], path: string) => {
    let newOpenFolders: Record<string, boolean> = {};
    const traverse = (items: FileTreeNode[]) => {
      for (const item of items) {
        if (path.includes(item.url)) {
          newOpenFolders[item.url] = true;
        }
        if (item.children) {
          traverse(item.children);
        }
      }
    };
    traverse(nodes);
    setOpenFolders(newOpenFolders);
  };

  const toggleFolder = (folderPath: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  const renderTree = (nodes: FileTreeNode[]) => {
    return nodes.map((node) => {
      const isActive = pathname === `/${node.url}`;
      const IconComponent = Icons[node.icon as keyof typeof Icons];

      if (node.type === "folder") {
        return (
          <SidebarGroup key={node.url} className="pl-4">
            <SidebarGroupLabel
              className={`cursor-pointer flex items-center justify-between gap-2 p-4 rounded transition mb-2 hover:bg-[var(--sidebar-accent)]/10 hover:text-[var(--sidebar-text)]`}
              onClick={() => toggleFolder(node.url)}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-[var(--sidebar-primary)]/10 rounded">
                  {IconComponent && <IconComponent className={`w-4 h-4 ${openFolders[node.url] ? "text-[var(--sidebar-primary)]" : "text-[var(--sidebar-text)]"}`} />}
                </div>
                <span className={`font-bold text-base ${openFolders[node.url] ? "text-[var(--sidebar-primary)]" : "text-[var(--sidebar-text)]"}`}>
                  {node.title}
                </span>
              </div>
              {openFolders[node.url] ? <ChevronDown className="w-4 h-4 text-[var(--sidebar-primary)]" /> : <ChevronRight className="w-4 h-4 text-[var(--sidebar-text)]/70" />}
            </SidebarGroupLabel>
            {openFolders[node.url] && (
              <SidebarGroupContent className="ml-6">
                {renderTree(node.children || [])}
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        );
      } else {
        return (
          <SidebarMenuItem
            key={node.url}
            className={`rounded transition mb-1 ${isActive ? "bg-[var(--sidebar-primary)]/10 border-l-4 border-[var(--sidebar-primary)] text-[var(--sidebar-primary)] font-semibold" : ""}`}
          >
            <SidebarMenuButton asChild>
              <a
                href={`/${node.url}`}
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive
                    ? "bg-[var(--sidebar-primary)]/10 border-l-4 border-[var(--sidebar-primary)] text-[var(--sidebar-primary)] font-semibold hover:bg-transparent"
                    : ""
                }`}
              >
                <span>- {node.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      }
    });
  };

  return (
    <Sidebar className="w-64 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] shadow-md p-0 mx-0">
      <SidebarContent className="pt-8">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderTree(fileTree)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}