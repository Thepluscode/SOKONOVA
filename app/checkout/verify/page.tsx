import { Suspense } from "react";
import PaymentVerifyClient from "./page-client";

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">Loading payment verification...</div>}>
      <PaymentVerifyClient />
    </Suspense>
  );
}
