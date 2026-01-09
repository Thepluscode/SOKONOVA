"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === "/seller" && pathname === "/seller") return true;
    if (path !== "/seller" && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-2">
        <Link 
          href="/seller" 
          className={`px-3 py-2 text-sm font-medium rounded-t-lg ${
            isActive("/seller") 
              ? "bg-muted border-b-2 border-primary" 
              : "hover:bg-muted"
          }`}
        >
          Dashboard
        </Link>
        <Link 
          href="/seller/trust" 
          className={`px-3 py-2 text-sm font-medium rounded-t-lg ${
            isActive("/seller/trust") 
              ? "bg-muted border-b-2 border-primary" 
              : "hover:bg-muted"
          }`}
        >
          Trust & Safety
        </Link>
        <Link 
          href="/seller/sponsored-placements" 
          className={`px-3 py-2 text-sm font-medium rounded-t-lg ${
            isActive("/seller/sponsored-placements") 
              ? "bg-muted border-b-2 border-primary" 
              : "hover:bg-muted"
          }`}
        >
          Sponsored Placements
        </Link>
        <Link 
          href="/seller/services" 
          className={`px-3 py-2 text-sm font-medium rounded-t-lg ${
            isActive("/seller/services") 
              ? "bg-muted border-b-2 border-primary" 
              : "hover:bg-muted"
          }`}
        >
          Services Marketplace
        </Link>
      </div>
      
      {children}
    </div>
  );
}