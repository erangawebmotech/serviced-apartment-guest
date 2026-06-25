"use client";
import { Suspense } from "react";
import PaymentFailed from "./Paymentfailed";

export default function PaymentFailedWrapper() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PaymentFailed />
    </Suspense>
  );
}
