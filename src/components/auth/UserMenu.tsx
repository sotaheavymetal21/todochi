"use client";

import { useAuth } from "@/contexts/AuthContext";
import { UserIcon, LogoutIcon } from "@/components/icons";

export default function UserMenu() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.user_metadata?.name || user.email?.split("@")[0];

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
          <UserIcon className="h-5 w-5 text-indigo-600" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-medium text-gray-900">
            {displayName}
          </p>
          <p className="truncate text-xs text-gray-500">{user.email}</p>
        </div>
      </div>
      <button
        onClick={signOut}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100"
      >
        <LogoutIcon className="h-5 w-5" />
        <span>ログアウト</span>
      </button>
    </div>
  );
}
