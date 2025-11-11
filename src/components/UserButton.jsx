"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { LogOut } from "lucide-react";

export function UserButton({ image }) {
  return (
    <div className="relative group">
      <Image
        src={image}
        alt="User"
        width={40}
        height={40}
        className="rounded-full cursor-pointer"
      />
      <div className="absolute right-0  hidden group-hover:flex flex-col bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-2 text-sm">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 px-6 py-2 rounded-md hover:bg-indigo-100 text-gray-700"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
