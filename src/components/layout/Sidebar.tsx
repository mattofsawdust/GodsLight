export function Sidebar() {
  return (
    <aside className="w-64 border-r p-4">
      <nav className="space-y-2">
        <a href="/daily-connection" className="block p-2 hover:bg-gray-100">Daily Connection</a>
        <a href="/love-list" className="block p-2 hover:bg-gray-100">Love List</a>
        <a href="/future-dates" className="block p-2 hover:bg-gray-100">Future Dates</a>
        {/* Add other navigation items */}
      </nav>
    </aside>
  )
}
