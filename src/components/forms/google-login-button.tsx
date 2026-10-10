"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { googleLoginAction } from "@/app/(auth)/actions";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (res: { credential: string }) => void;
          }) => void;
          renderButton: (
            el: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
        };
      };
    };
  }
}

export function GoogleLoginButton() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleCredential = useCallback(
    async (idToken: string) => {
      try {
        const state = await googleLoginAction(idToken);
        if (!state.success) {
          toast.error(state.message || "Google login failed");
          return;
        }
        toast.success(state.message || "Logged in with Google");
        router.push(state.redirectTo || "/");
        router.refresh();
      } catch (error: unknown) {
        const message = (error as { message?: string })?.message;
        toast.error(message || "Google login failed");
      }
    },
    [router],
  );

  useEffect(() => {
    if (!clientId) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: (res) => handleCredential(res.credential),
      });
      if (ref.current) {
        window.google?.accounts.id.renderButton(ref.current, {
          theme: "outline",
          size: "large",
          width: 320,
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [clientId, handleCredential]);

  if (!clientId) {
    return (
      <p className="text-center text-xs text-muted-foreground">
        Set NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable Google login.
      </p>
    );
  }

  return <div ref={ref} className="flex justify-center" />;
}
