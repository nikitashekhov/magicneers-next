'use client';
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function UserAvatar() {
    const { data: session, status } = useSession();

    return (
        <div>
            {status === "loading" ? (
            <div className="animate-pulse bg-gray-200 h-10 w-32 mx-auto rounded"></div>
            ) : session ? (
            <div className="flex items-center gap-2 align-center">
                <p className="text-base text-gray-700">
                    <span className="font-semibold">{session.user?.email}</span>
                </p>
                <Link href={((session.user as { role?: string }).role === "admin") ? "/certificates" : "/dashboard"}>
                    <Button>Личный кабинет</Button>
                </Link>
            </div>
            ) : (
            <div className="space-y-4">
                <div className="flex justify-center gap-4">
                    <Link href="/auth/signin">
                        <Button>Войти</Button>
                    </Link>
                </div>
            </div>
            )}
        </div>
  )
}