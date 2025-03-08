import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filePath = searchParams.get("path");

    if (!filePath) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    const docsDir = path.join(process.cwd(), "public", "docs");
    const fullPath = path.join(docsDir, filePath.replace(/-/g, " ") + ".md");

    if (!fullPath.startsWith(docsDir)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileContent = fs.readFileSync(fullPath, "utf-8");

    return new NextResponse(fileContent, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error reading file:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}