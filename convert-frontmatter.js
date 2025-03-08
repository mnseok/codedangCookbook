const fs = require('fs')
const path = require('path')

const DOCS_DIR = path.join(__dirname, 'public/docs') // 변환할 디렉토리

// 특정 폴더 내 모든 Markdown 파일 검색
function getMarkdownFiles(dir) {
  let files = []
  const items = fs.readdirSync(dir, { withFileTypes: true })

  items.forEach((item) => {
    const fullPath = path.join(dir, item.name)
    if (item.isDirectory()) {
      files = files.concat(getMarkdownFiles(fullPath))
    } else if (item.name.endsWith('.md')) {
      files.push(fullPath)
    }
  })

  return files
}

// TOML → YAML 변환 함수
function convertTOMLtoYAML(content) {
  if (content.startsWith('+++\n') && content.includes('\n+++')) {
    return content.replace(
      /\+\+\+\n([\s\S]*?)\n\+\+\+/,
      (match, frontMatter) => {
        const yamlFormatted = frontMatter
          .split('\n')
          .map((line) => {
            if (line.includes('=')) {
              let [key, value] = line.split('=')
              key = key.trim()
              value = value.trim()

              // 문자열 값이면 따옴표 추가
              if (
                !value.startsWith('"') &&
                !value.startsWith("'") &&
                isNaN(value)
              ) {
                value = `"${value}"`
              }

              return `${key}: ${value}`
            }
            return line
          })
          .join('\n')

        return `---\n${yamlFormatted}\n---`
      }
    )
  }
  return content
}

// 모든 파일 변환 실행
function convertAllFiles() {
  const markdownFiles = getMarkdownFiles(DOCS_DIR)

  markdownFiles.forEach((file) => {
    let content = fs.readFileSync(file, 'utf-8')
    let newContent = convertTOMLtoYAML(content)

    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf-8')
      console.log(`✅ 변환 완료: ${file}`)
    } else {
      console.log(`🔹 이미 변환됨: ${file}`)
    }
  })

  console.log('🎉 모든 파일 변환 완료!')
}

// 실행
convertAllFiles()
