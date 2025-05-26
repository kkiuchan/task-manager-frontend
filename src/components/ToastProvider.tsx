"use client";

import { Toast } from "@/components/ui/toast";
import { useToastStore } from "@/store/toastStore";

export function ToastProvider() {
  const message = useToastStore((state) => state.message);
  const hideToast = useToastStore((state) => state.hideToast);

  return message ? <Toast message={message} onClose={hideToast} /> : null;
}
