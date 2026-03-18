"use client";

import { useSession, signOut } from "next-auth/react";
import { Settings, LogOut, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="size-5 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      {/* Profile Section */}
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="size-4 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-sm text-gray-900">
                {session?.user?.name ?? "—"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Email
              </label>
              <p className="text-sm text-gray-900">
                {session?.user?.email ?? "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="size-4 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
          </div>
          <a href="/auth/reset-password">
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </a>
        </div>

        {/* Sign Out */}
        <div className="rounded-lg border border-red-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Sign Out
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Sign out of your account on this device.
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
          >
            <LogOut className="size-4 mr-1" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
