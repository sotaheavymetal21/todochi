"use client";

import Link from "next/link";
import { FolderIcon, PlusIcon, SettingsIcon } from "@/components/icons";
import UserMenu from "@/components/auth/UserMenu";

const DRAWER_WIDTH = 260;

export default function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-0 h-screen border-r border-gray-200 bg-white"
      style={{ width: DRAWER_WIDTH }}
    >
      <div className="flex h-16 items-center px-4">
        <span className="text-xl font-bold text-indigo-600">Todochi</span>
      </div>

      <hr className="border-gray-200" />

      <nav className="p-2">
        <Link
          href="/projects"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100"
        >
          <FolderIcon className="h-5 w-5" />
          <span>プロジェクト</span>
        </Link>
      </nav>

      <hr className="border-gray-200" />

      <nav className="p-2">
        <button
          disabled
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-400"
        >
          <PlusIcon className="h-5 w-5" />
          <span>新規プロジェクト</span>
        </button>
      </nav>

      <div className="absolute bottom-0 left-0 right-0">
        <hr className="border-gray-200" />
        <nav className="p-2">
          <button
            disabled
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-400"
          >
            <SettingsIcon className="h-5 w-5" />
            <span>設定</span>
          </button>
        </nav>
        <hr className="border-gray-200" />
        <div className="p-2">
          <UserMenu />
        </div>
      </div>
    </aside>
  );
}

export { DRAWER_WIDTH };
