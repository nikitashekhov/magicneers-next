export default function Footer() {
    return (
        <div className="text-center py-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} <a href="https://magicneers.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">Magicneers</a>. Все права защищены.</p>
        </div>
    )
}