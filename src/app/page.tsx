// app/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import PRInfo from "@/components/githubResults/PRInfo";
import TokenHandler from "@/components/TokenHandler";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <TokenHandler />
        <PRInfo />
      </main>
    </div>
  );
}