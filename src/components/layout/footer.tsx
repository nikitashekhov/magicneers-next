export default function Footer() {
    return (
        <div className="text-center py-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} <a href="https://magicneers.com" target="_blank" rel="noopener noreferrer" className="text-[#1EB7D9] hover:text-[#18CCF4]">Magicneers</a>. Все права защищены.</p>
        </div>
    )
}