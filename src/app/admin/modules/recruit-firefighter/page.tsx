import { Sidebar } from '@/components/ui/Sidebar'
import { Card, PrimaryButton } from '@/components/ui'
import Link from 'next/link'

export default function AdminDashboardFirefighter() {
  return (
    <div className="min-h-screen bg-neutral-light/20 flex">
      <Sidebar />

      <main className="flex-1 p-8 text-neutral-dark">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Bonjour [Prénom]</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-dark">
              Martin Delcourt<br /><span className="text-neutral text-xs">martin.delcourt@email.com</span>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card title="Nouvelles candidatures">
            <div className="text-4xl font-bold">5</div>
            <Link className='absolute top-0 right-4 mt-6 inline-flex items-center justify-center gap-2 px-6 py-2 bg-primary-500 hover:bg-primary-300 text-white font-semibold text-lg rounded-xl transition-colors duration-200' href="/admin/modules/recruit-firefighter/candidates">
              +
            </Link>
          </Card>

          <Card title="Candidatures en cours">
            <div className="text-4xl font-bold">5</div>
          </Card>

          <Card title="Demandes de transfert">
            <div className="text-4xl font-bold">5</div>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <Card title="Répartition des statuts">
              <div className="h-48 bg-neutral-light/40" />
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card title="Taux d'acceptation sur l'année civile">
              <div className="h-48 bg-neutral-light/40" />
            </Card>
          </div>

        </section>
      </main>
    </div>
  )
}
