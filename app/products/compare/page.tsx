import { Suspense } from "react";
import ProductComparisonClient from "./page-client";

export default function ProductComparisonPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">Loading comparison...</div>}>
      <ProductComparisonClient />
    </Suspense>
  );
}
