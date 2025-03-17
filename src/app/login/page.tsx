// app/login/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { ErrorMessage } from "@/components/ErrorMessage";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/Header";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleGitHubLogin = async () => {
    const redirectTo = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: redirectTo,
      },
    });

    if (error) {
      console.error("Error logging in with GitHub:", error.message);
    } else {
      // Redirect happens automatically via OAuth flow
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center">
        {error && <ErrorMessage message="Authentication failed. Please try again." />}
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <button 
          onClick={handleGitHubLogin}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}