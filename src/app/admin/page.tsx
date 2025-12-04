'use client'

import { useState } from 'react'
import Image from 'next/image'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import { IconButton } from '@/components/ui'


export default function RecruiterHome() {

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingModule, setPendingModule] = useState<string | null>(null)

  function openDeleteModal(moduleId: string) {
    setPendingModule(moduleId)
    setConfirmOpen(true)
  }

  function handleCancel() {
    setPendingModule(null)
    setConfirmOpen(false)
  }

  function handleConfirmDelete() {
    // mock delete
    alert(`Module "${pendingModule ?? 'inconnu'}" supprimé (mock)`)
    setPendingModule(null)
    setConfirmOpen(false)
  }

  return (
    <main className="flex-1 p-8">
      <header className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold pb-4">Mes modules</h1>
          <span>7 modules</span>
          <IconButton label="Ajouter un module" onClick={() => alert('Ajouter un module (mock)')} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md">
            <p>Ajouter un module</p>
          </IconButton>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-3 gap-6">

        <div className="h-auto min-h-[180px] p-4 bg-white rounded-lg shadow-sm flex flex-col items-center gap-3 relative justify-around">
          <div className="w-full h-12 bg-secondary rounded-full flex  gap-4" >
            <Image src="/assets/icons/recrutement.svg" alt="Icône Recrutement" className="w-8 h-8" />
            <div className="text-sm font-medium">Recrutement</div>
            <p className="absolute right-4 p-2 rounded bg-secondary-400 text-white">Inclus</p>
          </div>
          <div className='w-full gap-4 flex align-center justify-start'>
            <button className="px-3 py-1 h-full border border-primary-500 text-primary-500 rounded-md">Ouvrir</button>
            <button onClick={() => openDeleteModal('recrutement')} className="ml-2 p-2 rounded-md hover:bg-destructive/10">
              <Image src="/assets/icons/bin.svg" alt="Supprimer le module" className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="h-auto min-h-[180px] p-4 bg-white rounded-lg shadow-sm flex flex-col items-center gap-3 relative justify-around">
          <div className="w-full h-12 bg-secondary rounded-full flex  gap-4" >
            <Image src="/assets/icons/Planning.svg" alt="Icône Recrutement" className="w-8 h-8" />
            <div className="text-sm font-medium">Planning</div>
            <p className="absolute right-4 p-2 rounded bg-secondary-400 text-white">Inclus</p>
          </div>
          <div className='w-full gap-4 flex align-center justify-start'>
            <button className="px-3 py-1 h-full border border-primary-500 text-primary-500 rounded-md">Ouvrir</button>
            <button onClick={() => openDeleteModal('recrutement')} className="ml-2 p-2 rounded-md hover:bg-destructive/10">
              <Image src="/assets/icons/bin.svg" alt="Supprimer le module" className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="h-auto min-h-[180px] p-4 bg-white rounded-lg shadow-sm flex flex-col items-center gap-3 relative justify-around">
          <div className="w-full h-12 bg-secondary rounded-full flex  gap-4" >
            <Image src="/assets/icons/recrutement.svg" alt="Icône Recrutement" className="w-8 h-8" />
            <div className="text-sm font-medium">Formation</div>
            <p className="absolute right-4 p-2 rounded bg-secondary-400 text-white">Inclus</p>
          </div>
          <div className='w-full gap-4 flex align-center justify-start'>
            <button className="px-3 py-1 h-full border border-primary-500 text-primary-500 rounded-md">Ouvrir</button>
            <button onClick={() => openDeleteModal('recrutement')} className="ml-2 p-2 rounded-md hover:bg-destructive/10">
              <Image src="/assets/icons/bin.svg" alt="Supprimer le module" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <footer className="mt-8">
        <div className="flex items-center justify-between">
          <div>Résultat par page</div>
          <div>Pagination</div>
        </div>
      </footer>

      <ConfirmationModal
        open={confirmOpen}
        title="Supprimer le module"
        message={`Voulez-vous supprimer "${pendingModule ?? ''}" ?`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancel}
      />
    </main>
  )
}
