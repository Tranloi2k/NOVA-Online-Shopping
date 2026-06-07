"use client";

import { useEffect, useRef } from "react";
import { confirmCheckoutOrderAction } from "./actions";

export default function OrderConfirmTrigger({ sessionId }: { sessionId: string }) {
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current || !sessionId) return;
    triggered.current = true;

    confirmCheckoutOrderAction(sessionId).catch((err) => {
      console.error("OrderConfirmTrigger error:", err);
    });
  }, [sessionId]);

  return null;
}
