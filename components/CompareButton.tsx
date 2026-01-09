"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface CompareButtonProps {
  productId: string;
}

export function CompareButton({ productId }: CompareButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSelected, setIsSelected] = useState(false);

  const handleCompareClick = () => {
    // Get current compare list from URL
    const currentIds = searchParams.get("compare")?.split(",") || [];
    
    let newIds;
    if (isSelected) {
      // Remove from compare list
      newIds = currentIds.filter(id => id !== productId);
    } else {
      // Add to compare list
      newIds = [...currentIds, productId];
    }
    
    setIsSelected(!isSelected);
    
    // Update URL
    const params = new URLSearchParams(searchParams);
    if (newIds.length > 0) {
      params.set("compare", newIds.join(","));
    } else {
      params.delete("compare");
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <button
      onClick={handleCompareClick}
      className={`px-3 py-1 text-xs rounded-full border transition-colors ${
        isSelected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background text-foreground border-border hover:bg-secondary"
      }`}
    >
      {isSelected ? "Selected" : "Compare"}
    </button>
  );
}