import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, House } from "lucide-react";

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          segment = segment.replace(/-/g, " ");
          const href = "/" + pathSegments.slice(0, index + 1).join("/");
          const isHome = index === 0; // 홈 여부
          const isLast = index === pathSegments.length - 1;

          return (
            <BreadcrumbItem key={href}>
              {!isLast || isHome ? (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={href} className={!isLast ? "text-primary" : ""}>
                      {isHome ? <Home className="w-5 h-5 inline-block" /> : decodeURIComponent(segment)}
                    </Link>
                  </BreadcrumbLink>
                  {!isLast && <BreadcrumbSeparator />}
                </>
              ) : (
                <BreadcrumbPage>{decodeURIComponent(segment)}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}