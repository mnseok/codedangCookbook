import { searchMarkdownFiles } from "@/lib/searchMarkdown";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword");
    console.log(keyword);

    if (!keyword) {
        return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    const markdownDir = path.join(process.cwd(), "/public/docs"); // Markdown 파일 폴더 경로
    const results = searchMarkdownFiles(keyword, markdownDir);
    console.log(results);

    return NextResponse.json({ results });
}