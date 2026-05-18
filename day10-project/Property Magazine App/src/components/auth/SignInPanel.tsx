"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function SignInPanel() {
  const [error, setError] = React.useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = React.useState<"github" | "google" | null>(null);

  async function handleProviderSignIn(provider: "github" | "google") {
    setError(null);
    setLoadingProvider(provider);
    try {
      // Force account selection by adding parameters
      const signInOptions: any = {
        redirect: true,
        callbackUrl: "/profile"
      };

      if (provider === "google") {
        signInOptions.prompt = "select_account";
      } else if (provider === "github") {
        signInOptions.allow_signup = "true";
      }

      await signIn(provider, signInOptions);
    } catch (error) {
      setError("Sign-in failed. Please try again.");
      console.error(error);
    } finally {
      setLoadingProvider(null);
    }
  }

  return (
    <div className="space-y-3">
      <Button className="w-full" onClick={() => handleProviderSignIn("github")} disabled={loadingProvider !== null}>
        Continue with GitHub
      </Button>
      <Button
        className="w-full"
        variant="outline"
        onClick={() => handleProviderSignIn("google")}
        disabled={loadingProvider !== null}
      >
        Continue with Google
      </Button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      <p className="text-xs text-ink/60">
        Use a different Google account by choosing it in the Google sign-in popup.
      </p>
    </div>
  );
}
