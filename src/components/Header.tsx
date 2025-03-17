'use client';

import SignOutButton from "./SignOutButton";
import { User } from "@supabase/supabase-js";

interface HeaderProps {
  user?: User | null;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="w-full bg-gray-100 shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Github Productivity Insights</div>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-gray-700">{user.email}</span>
              <SignOutButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
} 