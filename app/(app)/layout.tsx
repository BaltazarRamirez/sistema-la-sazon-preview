import Sidebar from '@/components/Sidebar'
import { verifySession } from '@/lib/dal'
import { getMockContadores } from '@/lib/mock/dashboard'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await verifySession()
  const contadores = getMockContadores()

  return (
    <div className="min-h-screen md:flex">
      <Sidebar contadores={contadores} />
      <main className="flex-1 min-w-0 px-4 py-6 md:px-9 md:py-9">
        <div className="max-w-6xl mx-auto anim-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
