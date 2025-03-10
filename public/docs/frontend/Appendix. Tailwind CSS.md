---
title: "Appendix. Tailwind CSS"
description: "CSS 유틸리티 라이브러리인 Tailwind CSS를 알아봅니다."
icon: "article"
date: "2023-09-11"
lastmod: "2023-10-05"
weight: 290
---

새로운 class와 id의 이름을 짓고 기존의 class와 id의 이름을 기억하는 일은 정말 힘들어요. 하지만 특정한 속성과 값을 가지는 class를 미리 만들어두고 이를 재사용하면 이러한 문제점이 해결되지 않을까요? 이런 아이디어에서 출발한 CSS 유틸리티 라이브러리인 Tailwind CSS를 알아보아요!

## 📚 공부할 내용

- [Tailwind CSS 기초 가이드](https://www.youtube.com/watch?v=xT8bFaHA0tc&list=PLkfUwwo13dlUzcBq9qnjDdybJPKZZvNI1&index=1&ab_channel=%EC%A0%9C%EC%A3%BC%EC%BD%94%EB%94%A9%EB%B2%A0%EC%9D%B4%EC%8A%A4%EC%BA%A0%ED%94%84)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)

기초 가이드 영상을 간단하게 살펴보고 프로젝트 실습을 하면서 감을 익히는 게 좋을 것 같아요. 실습 과정에서 필요한 내용은 공식 문서를 참고하면 됩니다.

## 🎯 프로젝트 실습 (Next.js 를 설치했다면 하지 않아도 됩니다!)

Tailwind CSS를 프로젝트에 설치 및 환경 설정하고 기존에 작성한 CSS 코드는 다 지우고 Tailwind CSS를 사용으로 전환해요.

### 0. Editor 셋업

1. `Tailwind CSS IntelliSense` 확장 프로그램을 설치해요.
   1. `Ctrl + Shift + P`를 눌러 명령 팔레트를 열어요.
   2. `Preferences: Open Default Settings (JSON)`를 입력하고 엔터를 눌러요.
   3. `"editor.quickSuggestions":{ "strings": true }`를 추가해요.
   4. 이렇게 해야 Tailwind CSS의 class를 자동 완성할 수 있어요.
2. `npm install -D prettier prettier-plugin-tailwindcss` 또는 `pnpm install -D prettier prettier-plugin-tailwindcss` 명령어를 통해 Prettier와 Tailwind CSS 플러그인을 설치해요.
   1. `module.exports = { plugins: ['prettier-plugin-tailwindcss'], }`를 `prettier.config.js` 파일에 추가해요.
   2. 이렇게 해야 Tailwind CSS의 class를 자동 정렬할 수 있어요.

### 1. Tailwind CSS 설치

1. `npm install tailwindcss` 또는 `pnpm install tailwindcss` 명령어를 통해 Tailwind CSS를 설치해요.
2. `npx tailwindcss init` 또는 `pnpx tailwindcss init` 명령어를 통해 `tailwind.config.js` 파일을 생성해요.
3. `tailwind.config.js` 파일에서 `content` 속성에 `['./src/**/*.{js,jsx,ts,tsx}']`를 추가해요.
4. `App.css` 파일에 `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`를 추가해요.
5. `npm run start` 또는 `pnpm run start` 명령어를 통해 프로젝트를 실행해요.

### 2. Tailwind CSS 사용

- class 또는 id를 하나씩 지우고 Tailwind CSS으로 대체해요!
- `App.css` 파일에 위에서 추가한 @tailwind 3 줄 빼고는 모두 없어야 해요.
