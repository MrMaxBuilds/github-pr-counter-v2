// app/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/Header";

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
        <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
        <p className="text-gray-600">This is your personalized dashboard.</p>
      </main>
    </div>
  );
}