'use client'

import { Icons } from '@/components/icons'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink
} from '@/components/ui/navigation-menu'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

export default function Home() {
  return (
    <main className="">
      {/* Header */}
      <header
        className={
          'bg-background text-foreground sticky top-0 z-50 flex items-center justify-between px-32 py-4 transition-shadow'
        }
      >
        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Logo" width={36} height={36} />
        </Link>

        {/* Center: GitHub Icon + Navigation Menu */}
        <div className="flex items-center gap-8">
          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-6">
              {['Infra', 'Backend', 'Frontend', 'Design', 'Plan'].map(
                (item) => (
                  <NavigationMenuItem key={item}>
                    <Link
                      href={`/docs/${item.toLowerCase()}`}
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink className="text-muted hover:text-primary text-sm font-bold">
                        {item}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* GitHub Icon */}
          <Link
            href="https://github.com/skkuding"
            target="_blank"
            className="text-muted hover:text-primary"
          >
            <Icons.github className="h-6 w-6" />
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main className="bg-background text-foreground mx-auto min-h-screen py-4">
        {/* Hero Section */}
        <section className="flex w-full flex-col items-center justify-between pl-30 md:flex-row">
          {/* Left Content */}
          <div className="max-w-lg">
            <h1 className="text-foreground text-6xl font-bold">Cookbook</h1>
            <p className="text-foreground mt-4">
              스꾸딩의 신입 팀원들을 위해 스꾸딩의 개발 레시피를 모아둔
              곳입니다!
            </p>
            <p className="text-foreground">
              필요한 기술 지식을 익히고 프로젝트에 적용해보세요.
            </p>
            <Link
              href="/docs"
              className="bg-primary hover:bg-primary/90 mt-6 inline-flex items-center rounded-md px-6 py-3 font-bold text-white"
            >
              <Icons.rocket className="mr-2" />
              <span>Get Started</span>
            </Link>
          </div>

          {/* Right Image */}
          <div className="relative h-[800px] w-1/2 overflow-hidden">
            <Image
              src="/images/notion.png"
              alt="Cookbook Preview"
              fill
              style={{ objectFit: 'cover', objectPosition: 'left center' }} // ✅ objectFit과 objectPosition을 style로 이동
              className="absolute right-0 object-cover object-right"
            />
          </div>
        </section>

        {/* Study Section */}
        <section className="mt-16 px-30 text-center">
          <h2 className="text-foreground text-3xl font-bold">
            스꾸딩의 스터디는 어떻게 진행되나요?
          </h2>
          <p className="text-foreground mt-8">
            신입 팀원들은 프로젝트에 참여하기 전, 한 학기 동안 스터디를
            진행해요.
          </p>
          <p className="text-foreground">
            프로젝트에 필요한 기술을 익히고, 실제 프로젝트에 적용해보는 시간을
            가질 수 있어요.
          </p>

          {/* Study Features */}
          <div className="mt-20 grid gap-8 md:grid-cols-3">
            {[
              {
                title: '8주간의 스터디',
                description:
                  '총 8주 동안 진행되며, 매주 1회씩 스터디를 진행해요. 팀별로 정한 시간에 매주 모여서 스터디를 진행해요.',
                icon: 'calendarCheck'
              },
              {
                title: '스터디 주제',
                description:
                  '차근차근 배울 수 있는 순서로 멘토들이 주제들을 준비했어요. 각 주제는 이론과 실습으로 구성되어 있어요.',
                icon: 'bookMarked'
              },
              {
                title: '진행 방식',
                description:
                  '정해진 주제를 각자 일주일 동안 공부하고 스꾸딩 노션 페이지에 정리해요. 스터디 시간에는 각자 공부한 내용을 공유해요.',
                icon: 'users'
              },
              {
                title: '점진적인 프로젝트',
                description:
                  '스터디를 통해 배운 내용을 실습할 수 있는 미니 프로젝트를 진행해요. 8주동안 이어서 진행되니까, 이전 주차 내용을 놓치지 않도록 꾸준히 따라와주세요.',
                icon: 'trendingUp'
              },
              {
                title: '권장 사항',
                description:
                  '스터디 내용들은 프로그래밍 언어를 하나쯤 배워본 사람들이 따라올 수 있게 준비되어 있어요. 프로그래밍 언어 경험이 없다면, JavaScript를 미리 공부하는 것을 추천해요.',
                icon: 'lightbulb'
              },
              {
                title: '궁금한 점이 생기면',
                description:
                  '스터디 중에 궁금한 점이 생기면, Teams 채널에 자유롭게 질문해주세요. 멘토들이 최대한 도와드릴 거예요!',
                icon: 'circleHelp'
              }
            ].map((item, index) => {
              const IconComponent = Icons[item.icon as keyof typeof Icons]
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-lg p-4"
                >
                  {/* 아이콘 컨테이너 */}
                  <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded">
                    {IconComponent && (
                      <IconComponent className="text-primary h-6 w-6" />
                    )}
                  </div>
                  {/* 텍스트 컨텐츠 */}
                  <div className="text-left">
                    <h1 className="text-foreground text-2xl font-bold">
                      {item.title}
                    </h1>
                    <p className="text-m text-foreground mt-3">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </main>
  )
}
