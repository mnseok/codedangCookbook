import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const requestedPath = url.searchParams.get("path")?.replace(/"/g, "") || "";
  const docsDir = path.join(process.cwd(), "public/docs");
  let fullRequestedPath = path.join(docsDir, requestedPath);

  if (!fs.existsSync(fullRequestedPath)) {
    if (!fs.existsSync(fullRequestedPath.replace(/-/g, " ") + ".md")) {
      return NextResponse.json({ error: "Path not found" }, { status: 404 });
    } else {
        fullRequestedPath = fullRequestedPath.replace(/-/g, " ") + ".md";
    }
  }

  function getMetadataFromMarkdown(filePath: string) {
    if (!fs.existsSync(filePath)) return { title: "", description: "", icon: "article" };

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    return {
      title: data.title || "",
      description: data.description || "",
      icon: data.icon || "article",
    };
  }

  let current;
  if (fs.statSync(fullRequestedPath).isDirectory()) {
    const metadata = getMetadataFromMarkdown(path.join(fullRequestedPath, "_index.md"));
    current = {
      type: "folder",
      name: path.basename(fullRequestedPath),
      path: requestedPath,
      title: metadata.title || path.basename(fullRequestedPath),
      description: metadata.description || "",
      url: requestedPath.replace(/ /g, "-"),
      icon: metadata.icon || "folder",
    };
  } else {
    const metadata = getMetadataFromMarkdown(fullRequestedPath);
    current = {
      type: "file",
      name: path.basename(fullRequestedPath).replace(".md", ""),
      path: requestedPath.replace(".md", ""),
      title: metadata.title || path.basename(fullRequestedPath).replace(".md", ""),
      description: metadata.description || "",
      url: requestedPath.replace(/ /g, "-").replace(".md", ""),
      icon: metadata.icon || "article",
    };
  }

  return NextResponse.json(current);
}