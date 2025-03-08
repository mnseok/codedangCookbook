"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import { Icons } from "@/components/icons";
import { ArrowLeft, ArrowRight, Folder } from "lucide-react";
import { AppSidebar } from "@/components/appSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FileTreeNode } from "@/app/api/docs/route";
import { DynamicBreadcrumb } from "@/components/dynamicBreadcrumb";
import Link from "next/link";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import TableOfContents from "@/components/tableOfContents";
import Image from "next/image";
import ScrollIndicator from "@/components/scrollIndicator";

export default function DocsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [fileTree, setFileTree] = useState<FileTreeNode[]>([]);
  const [current, setCurrent] = useState<FileTreeNode | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string | null>("");
  const [prev, setPrev] = useState<FileTreeNode | null>(null);
  const [next, setNext] = useState<FileTreeNode | null>(null);

  const pathname = usePathname();
  const currentPath = pathname.replace("/docs", "").replace(/^\//, "");

  useEffect(() => {
    async function fetchCurrentInfo() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/docs/current?path=\"${encodeURIComponent(currentPath)}\"`);
        if (!response.ok) throw new Error("Failed to fetch current info");
  
        const data = await response.json();
  
        setCurrent(data);
  
        if (data.type === "file") {
          await fetchMarkdownContent(data.path);
          fetchPrevNext();
        } else {
          fetchFileTree();
        }
        
      } catch (error) {
        console.error("Error fetching current info:", error);
        setCurrent(null);
      } finally {
        setIsLoading(false);
      }
    }
  
    async function fetchFileTree() {
      try {
        const response = await fetch(`/api/docs?path=\"${encodeURIComponent(currentPath)}\"`);
        if (!response.ok) throw new Error("Failed to fetch file tree");
  
        const data = await response.json();

        setFileTree(data);
      } catch (error) {
        console.error("Error fetching file tree:", error);
        setFileTree([]);
      }
    }

    async function fetchPrevNext() {
      try {
        const url = currentPath.split("/").slice(0, -1).join("/");
        const response = await fetch(`/api/docs?path=\"${encodeURIComponent(url)}\"`);
        if (!response.ok) throw new Error("Failed to fetch prev/next");
  
        const data = await response.json();

        const currentIndex = data.findIndex((item: FileTreeNode) => item.url?.replace("docs/", "") === currentPath);
        if (currentIndex === -1) throw new Error("Current item not found in file tree");

        setPrev(data[currentIndex - 1] || null);
        setNext(data[currentIndex + 1] || null);
      } catch (error) {
        console.error("Error fetching prev/next:", error);
        setPrev(null);
        setNext(null);
      }
    }
  
    fetchCurrentInfo();
  }, [currentPath]);
  
  const fetchMarkdownContent = async (path: string) => {
    try {
      const response = await fetch(`/api/docs/content?path=${encodeURIComponent(path)}`);
      if (!response.ok) throw new Error("Markdown file not found");
  
      const text = await response.text();
      const { content } = matter(text);
      
      setMarkdownContent(content);
    } catch (error) {
      console.error("Error fetching markdown content:", error);
      setMarkdownContent("## Error: Markdown content not found.");
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
        <div className="flex flex-col">
          <Header />
          <div className="flex flex-col min-h-screen">
            <div className="pt-10 px-24 mx-auto min-h-screen bg-background text-foreground">
              {isLoading && (
                <div className="flex items-center justify-center h-screen w-full">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
                </div>
              )}

              <DynamicBreadcrumb />
              <h1 className="text-3xl font-bold mb-6 mt-10">
                {`${current?.title}`}
              </h1>

            {/* 파일이 `.md`이면 Markdown 렌더링 */}
            {current?.type === "file" ? (
              <div className="prose prose-neutral dark:prose-invert max-w-none pr-52">
                <ScrollIndicator />
                {markdownContent ? (
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[
                      rehypeSlug,
                      [
                        rehypeAutolinkHeadings,
                        {
                          properties: {
                            className: ['anchor'],
                          },
                        },
                      ],
                    ]}
                    components={{
                      img: ({ src, alt }) => {
                        if (!src) return null;
                        return (
                          <Image 
                            src={src.startsWith("http") ? src : `/docs/${currentPath}/${src}`}
                            alt={alt || "Image"}
                            width={600}
                            height={400}
                            className="rounded-lg"
                            priority
                          />
                        );
                      }
                    }}
                  >
                    {markdownContent
                      .replace(/<!--.*?-->/g, "")
                      .replace(/%20/g, "-")
                      .replace(/\(\.?\/?([^()\s]+)\.md\)/g, "($1)")
                      .replace(/\(<\.?\/?([^()\s]+)\.md>\)/g, "($1)")
                      .replace(/{{<\s*figure\s+src="([^"]+)"\s+alt="([^"]+)"\s*>}}/g, "![$2]($1)")
                      .replace(/<p\s+align="center">\s*<img\s+src="([^"]+)"\s+width="\d+"\s*>\s*<\/p>/g, "![]($1)")
                    }
                  </ReactMarkdown>
                ) : (
                  <p className="text-gray-500">📄 Markdown content is loading...</p>
                )}
                <TableOfContents />
                <div className="flex justify-between py-10">
                  {prev ? (
                    <Link
                      href={`/${prev.url}`}
                      className="flex items-center gap-3 px-4 py-2 border border-primary rounded-lg 
                                text-primary hover:bg-primary hover:text-white transition-all duration-300 ease-in-out no-underline"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span className="font-semibold">{prev.title}</span>
                    </Link>
                  ) : <div />}

                  {next ? (
                    <Link
                      href={`/${next.url}`}
                      className="flex items-center gap-3 px-4 py-2 border border-primary rounded-lg 
                                text-primary hover:bg-primary hover:text-white transition-all duration-300 ease-in-out no-underline"
                    >
                      <span className="font-semibold">{next.title}</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  ): <div />}
                </div>
              </div>
            ) : (
              // 폴더일 경우 하위 파일 목록 표시
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fileTree.map((item) => {
                  const IconComponent = Icons[item.icon as keyof typeof Icons];

                  return (
                    <Link
                      href={`/${item.url}`}
                      key={item.title}
                      className="group relative p-6 border rounded shadow-sm transition-colors duration-500 ease-out 
                                bg-background hover:bg-primary hover:text-white hover:border-transparent"
                    >
                      {/* 아이콘 & 팀명 */}
                      <div className="flex items-center justify-between mb-3">
                        {IconComponent && (
                          <IconComponent className="w-6 h-6 text-primary transition-colors duration-300 ease-out 
                                                    group-hover:text-white" />
                        )}
                        {item.type === "folder" && (
                          <div className="w-6 h-6 rounded-md">
                            <Folder />
                          </div>
                        )}
                      </div>

                      {/* 제목 */}
                      <h2 className="text-xl font-semibold transition-colors duration-300 ease-out group-hover:text-white pt-5">
                        {item.title || item.title}
                      </h2>

                      {/* 설명 */}
                      <p className="text-gray-500 transition-colors duration-300 ease-out group-hover:text-gray-300">
                        {item.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
