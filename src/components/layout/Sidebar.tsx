"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowRightLeft, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/20 sm:flex">
      <div className="flex h-14 items-center border-b px-4 lg:h-15 lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-primary font-bold text-md flex items-center gap-x-2">
            <Zap className="h-4 w-4" />
            Internal Ops
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary border border-transparent",
              pathname === "/dashboard"
                ? "border border-gray-200/50 bg-muted text-primary"
                : "text-muted-foreground",
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/transactions"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary border border-transparent",
              pathname === "/transactions"
                ? "border border-gray-200/50 bg-muted text-primary"
                : "text-muted-foreground",
            )}
          >
            <ArrowRightLeft className="h-4 w-4" />
            Transactions
          </Link>
        </nav>
      </div>
    </aside>
  );
}
