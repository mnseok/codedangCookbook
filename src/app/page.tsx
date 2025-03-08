"use client";

import * as React from "react";
import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Icons } from "@/components/icons";
import Image from "next/image";

export default function Home() {
  return (
    <main className="">
      {/* Header */}
      <header
        className={"sticky top-0 z-50 flex items-center justify-between px-32 py-4 bg-background text-foreground transition-shadow"}
      >
        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Logo" width={48} height={48} />
        </Link>

        {/* Center: GitHub Icon + Navigation Menu */}
        <div className="flex items-center gap-8">
          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-6">
              {["Infra", "Backend", "Frontend", "Design", "Plan"].map((item) => (
                <NavigationMenuItem key={item}>
                  <Link href={`/docs/${item.toLowerCase()}`} legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm font-bold text-muted hover:text-primary">
                      {item}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* GitHub Icon */}
          <Link href="https://github.com/skkuding" target="_blank" className="text-muted hover:text-primary">
            <Icons.github className="h-6 w-6" />
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main className="py-4 mx-auto min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between w-full pl-30">
          {/* Left Content */}
          <div className="max-w-lg">
            <h1 className="text-6xl font-bold text-foreground">Cookbook</h1>
            <p className="text-foreground mt-4">
              스꾸딩의 신입 팀원들을 위해 스꾸딩의 개발 레시피를 모아둔 곳입니다!
            </p>
            <p className="text-foreground">
              필요한 기술 지식을 익히고 프로젝트에 적용해보세요.
            </p>
            <Link href="/docs" className="mt-6 inline-flex items-center bg-primary text-white font-bold px-6 py-3 rounded-md hover:bg-primary/90">
              <Icons.rocket className="mr-2" />
              <span>Get Started</span>
            </Link>
          </div>
          
          {/* Right Image */}
          <div className="relative w-1/2 h-[800px] overflow-hidden">
            <Image
              src="/images/notion.png"
              alt="Cookbook Preview"
              fill
              style={{ objectFit: "cover", objectPosition: "left center" }} // ✅ objectFit과 objectPosition을 style로 이동
              className="absolute right-0 object-cover object-right"
            />
          </div>
        </section>

        {/* Study Section */}
        <section className="mt-16 text-center px-30">
          <h2 className="text-3xl font-bold text-foreground">스꾸딩의 스터디는 어떻게 진행되나요?</h2>
          <p className="text-foreground mt-8">
            신입 팀원들은 프로젝트에 참여하기 전, 한 학기 동안 스터디를 진행해요.
          </p>
          <p className="text-foreground">
            프로젝트에 필요한 기술을 익히고, 실제 프로젝트에 적용해보는 시간을 가질 수 있어요.
          </p>

          {/* Study Features */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            {[
              { title: "8주간의 스터디", description: "총 8주 동안 진행되며, 매주 1회씩 스터디를 진행해요. 팀별로 정한 시간에 매주 모여서 스터디를 진행해요.", icon: "calendarCheck" },
              { title: "스터디 주제", description: "차근차근 배울 수 있는 순서로 멘토들이 주제들을 준비했어요. 각 주제는 이론과 실습으로 구성되어 있어요.", icon: "bookMarked" },
              { title: "진행 방식", description: "정해진 주제를 각자 일주일 동안 공부하고 스꾸딩 노션 페이지에 정리해요. 스터디 시간에는 각자 공부한 내용을 공유해요.", icon: "users" },
              { title: "점진적인 프로젝트", description: "스터디를 통해 배운 내용을 실습할 수 있는 미니 프로젝트를 진행해요. 8주동안 이어서 진행되니까, 이전 주차 내용을 놓치지 않도록 꾸준히 따라와주세요.", icon: "trendingUp" },
              { title: "권장 사항", description: "스터디 내용들은 프로그래밍 언어를 하나쯤 배워본 사람들이 따라올 수 있게 준비되어 있어요. 프로그래밍 언어 경험이 없다면, JavaScript를 미리 공부하는 것을 추천해요.", icon: "lightbulb" },
              { title: "궁금한 점이 생기면", description: "스터디 중에 궁금한 점이 생기면, Teams 채널에 자유롭게 질문해주세요. 멘토들이 최대한 도와드릴 거예요!", icon: "circleHelp" },
            ].map((item, index) => {
              const IconComponent = Icons[item.icon as keyof typeof Icons];
              return (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg">
                  {/* 아이콘 컨테이너 */}
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded flex-shrink-0 ">
                    {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
                  </div>
                  {/* 텍스트 컨텐츠 */}
                  <div className="text-left">
                    <h1 className="text-2xl font-bold text-foreground">{item.title}</h1>
                    <p className="text-m text-foreground mt-3">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </main>
  );
}
