'use client';
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, House } from "lucide-react";

export default function UserAvatar() {
    const { data: session, status } = useSession();

    return (
        <div>
            {status === "loading" ? (
            <div className="animate-pulse bg-gray-200 h-10 w-10 mx-auto rounded"></div>
            ) : session ? (
            <div className="flex items-center gap-2 align-center">
                <p className="hidden md:block text-base text-gray-700">
                    <span className="font-semibold">{session.user?.email}</span>
                </p>
                <Link 
                href={((session.user as { role?: string }).role === "admin") ? "/certificates" : "/dashboard"}
                className="bg-[#1EB7D9] text-white py-2 px-3 rounded text-sm font-medium hover:bg-[#18CCF4] transition-colors cursor-pointer flex items-center justify-center">
                    <House />
                </Link>
            </div>
            ) : (
            <div className="space-y-4">
                <div className="flex justify-center gap-4">
                    <Link href="/auth/signin" className="bg-[#1EB7D9] text-white py-3 px-4 rounded text-sm font-medium hover:bg-[#18CCF4] transition-colors cursor-pointer flex items-center justify-center">
                        <span className="hidden md:block">Войти</span> <ArrowRight className="md:ml-2 w-4 h-4" />
                    </Link>
                </div>
            </div>
            )}
        </div>
  )
}