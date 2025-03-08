"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./themeToggle";
import { SidebarTrigger } from "./ui/sidebar";

type FileTreeNode = {
  type: "folder" | "file";
  path: string;
  title: string;
  description: string;
  icon: string;
  url: string;
};

export default function Header() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<FileTreeNode[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (search.trim() === "") {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      try {
        const res = await fetch(`/api/search?keyword=${search}`);
        if (!res.ok) throw new Error("Failed to fetch search results");

        const data = await res.json();
        setSearchResults(data.results);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
      }
    };

    const debounceTimer = setTimeout(fetchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  return (
    <header 
      className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 bg-background text-foreground "
      style={{ width: `calc(100vw - var(--sidebar-width, 0px))` }}
    >
      {/* Left: Logo & Sidebar Button */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <SidebarTrigger />
        <Link href="/" className="relative w-8 h-8 md:w-10 md:h-10">
          <Image
            src="/images/logo.png"
            alt="Logo"
            fill
            sizes="(max-width: 768px) 100vw, 8px"
            className="object-contain"
          />
        </Link>
      </div>

      {/* Center: Search Bar (Hidden on Mobile) */}
      <div className="hidden md:flex relative flex-col items-center w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div className="flex items-center space-x-2 px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 w-full">
          <Search className="h-5 w-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            className="bg-transparent border-none focus:ring-0 focus:outline-none text-gray-700 dark:text-gray-300 w-full"
          />
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-12 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg max-h-60 overflow-y-auto z-50">
            {searchResults.map((item, index) => (
              <Link
                key={index}
                href={`/docs/${item.url}`}
                className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Right: GitHub & Theme Toggle */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <a
          href="https://github.com/skkuding"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <Github className="h-5 w-5 md:h-6 md:w-6 text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary" />
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
