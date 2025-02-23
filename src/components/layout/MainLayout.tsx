export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="container mx-auto p-4">Header</nav>
      </header>
      <div className="flex">
        <aside className="w-64 border-r p-4">Sidebar</aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
