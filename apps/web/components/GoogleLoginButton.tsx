"use client";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { api, setToken } from "@/lib/api";

export function GoogleLoginButton() {
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
  if (!clientId) return null;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={async (response) => {
          if (!response.credential) return;
          const result = await api<{ token: string }>("/api/auth/google", {
            method: "POST",
            body: JSON.stringify({ credential: response.credential })
          });
          setToken(result.token);
          router.push("/dashboard");
        }}
        onError={() => undefined}
        width="100%"
      />
    </GoogleOAuthProvider>
  );
}
