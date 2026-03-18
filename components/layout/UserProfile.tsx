"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";

export function UserProfile() {
  const { data: session } = useSession();
  const router = useRouter();
  const name = session?.user?.name ?? "User";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
        {initials}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="truncate text-sm font-medium text-gray-900">
          {name}
        </p>
        <p className="truncate text-xs text-gray-500">
          {session?.user?.email ?? ""}
        </p>
      </div>
      <button
        className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        aria-label="Settings"
        onClick={() => router.push("/dashboard/settings")}
      >
        <Settings className="h-4 w-4" />
      </button>
    </div>
  );
}
