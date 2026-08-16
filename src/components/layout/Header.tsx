"use client";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const pageName = pathname === "/transactions" ? "Transactions" : "Dashboard";

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/20 px-4 lg:h-15 lg:px-6">
      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold text-foreground hidden md:block">
          {pageName}
        </h1>
      </div>
      {/* <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
        <span>Product Team</span>
      </div> */}
    </header>
  );
}
