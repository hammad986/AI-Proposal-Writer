import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

export function AppShell({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar title={title} />
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  )
}
