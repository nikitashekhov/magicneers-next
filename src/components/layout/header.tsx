import Link from "next/link";
import UserAvatar from "../user-avatar";
import Image from "next/image";

export default function Header() {
    return (
        <div className="flex items-center justify-between mb-4">
            <div>
                <h1 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Link href="/">
                        <Image src="/images/magicneers.svg" alt="Magicneers" width={140} height={24} />
                    </Link> 
                    <span className="font-bold text-gray-900 font-playfair-display">Сертификаты</span>
                </h1>
            </div>
            
            <div className="flex items-center space-x-4">
                <UserAvatar />
            </div>
        </div>
    )
}