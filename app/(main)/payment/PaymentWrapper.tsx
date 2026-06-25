"use client";
import { Suspense } from "react";
import PaymentSuccess from "./PaymentSuccess";

export default function PaymentWrapper() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PaymentSuccess />
    </Suspense>
  );
}
