'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import ConfirmationModal from '@/components/ui/ConfirmationModal'
import { IconButton } from '@/components/ui'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from 'react-toastify'
import { getAllModuleDefinitions, getModuleDefinition } from '@/core/config/module-registry'

type Module = {
  id: string
  name: string
  category: string
  description?: string
}

/** Génère les données de preview de la modale directement depuis le MODULE_REGISTRY */
const MODULE_PREVIEW_DATA = getAllModuleDefinitions().map((mod) => ({
  name: mod.name,
  icon: mod.icon,
  description: mod.description,
  image: "/assets/images/onboarding.png",
}))

export default function RecruiterHome() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'modules' | 'support'>('modules')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [pendingModule, setPendingModule] = useState<Module | null>(null)
  const [selectedPreview, setSelectedPreview] = useState(MODULE_PREVIEW_DATA[2]) // Chat interne par défaut pour correspondre à la maquette
  const [subscriptionModal, setSubscriptionModal] = useState<{ show: boolean, type: 'add' | 'remove', name: string }>({
    show: false,
    type: 'add',
    name: ''
  })

  const fetchModules = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/modules")
      if (response.ok) {
        const data = await response.json()
        setModules(data.modules)
      }
    } catch (error) {
      console.error("Erreur fetchModules:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModules()
  }, [])

  function openDeleteModal(module: Module) {
    setPendingModule(module)
    setConfirmOpen(true)
  }

  function handleCancel() {
    setPendingModule(null)
    setConfirmOpen(false)
  }

  async function handleConfirmDelete() {
    if (!pendingModule) return

    try {
      const response = await fetch("/api/user/modules/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId: pendingModule.id })
      })

      if (response.ok) {
        toast.success(`Module ${pendingModule.name} supprimé`)
        setSubscriptionModal({ show: true, type: 'remove', name: pendingModule.name })
        fetchModules()
        // On ne reload plus immédiatement pour laisser voir la modal
        // window.location.reload()
      } else {
        toast.error("Erreur lors de la suppression")
      }
    } catch (error) {
      toast.error("Une erreur est survenue")
    } finally {
      setPendingModule(null)
      setConfirmOpen(false)
    }
  }

  async function handleAddModule(name: string) {
    setAddLoading(true)
    try {
      const response = await fetch("/api/user/modules/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleName: name })
      })

      if (response.ok) {
        toast.success(`Module ${name} ajouté avec succès`)
        setAddOpen(false)
        setSubscriptionModal({ show: true, type: 'add', name })
        fetchModules()
        // window.location.reload()
      } else {
        const data = await response.json()
        toast.error(data.message || "Erreur lors de l'ajout")
      }
    } catch (error) {
      toast.error("Erreur de connexion")
    } finally {
      setAddLoading(false)
    }
  }

  const getModuleIcon = (name: string) => {
    const def = getModuleDefinition(name)
    return def?.icon ?? "/assets/icons/recrutement.svg"
  }

  const getModuleUrl = (name: string) => {
    const def = getModuleDefinition(name)
    if (def && def.adminRoutes.length > 0) return def.adminRoutes[0].href
    return "#"
  }

  return (
    <main className="flex-1 p-8 bg-white min-h-screen">
      <header className="flex flex-col mb-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Modules</h1>
        <div className="flex border-b border-neutral-100 mb-8">
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-6 py-3 border-b-2 font-bold text-sm transition-all ${activeTab === 'modules' ? 'border-primary-500 text-slate-800' : 'border-transparent text-neutral-400'
              }`}
          >
            Mes modules
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-6 py-3 border-b-2 font-bold text-sm transition-all ${activeTab === 'support' ? 'border-primary-500 text-slate-800' : 'border-transparent text-neutral-400'
              }`}
          >
            Support
          </button>
        </div>
        {activeTab === 'modules' && (
          <div>
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 bg-[#E67E22] hover:bg-[#D35400] text-white font-bold rounded-xl px-6 py-2.5 transition-colors"
            >
              Ajouter un module +
            </button>
          </div>
        )}
      </header>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : activeTab === 'support' ? (
        <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white rounded-3xl p-10 border border-neutral-100 max-w-xl shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
            <h2 className="text-2xl font-bold text-slate-800 mb-10">Contacter un commercial</h2>

            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100 group-hover:bg-neutral-100 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span className="text-lg font-medium text-slate-600">Barbier Paul</span>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100 group-hover:bg-neutral-100 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <span className="text-lg font-medium text-slate-600">00 00 00 00 00</span>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100 group-hover:bg-neutral-100 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <span className="text-lg font-medium text-slate-600">vitallcommercial@mail.com</span>
              </div>
            </div>
          </div>
        </section>
      ) : modules.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {modules.map((module) => (
            <div
              key={module.id}
              className="bg-white rounded-3xl p-8 border border-neutral-100 flex flex-col transition-all hover:shadow-[0_4px_25px_rgba(0,0,0,0.04)] relative min-h-[160px]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Image
                    src={getModuleIcon(module.name)}
                    width={24}
                    height={24}
                    alt={module.name}
                  />
                </div>
                <h3 className="text-lg font-bold text-slate-800">{module.name}</h3>
                <span className="absolute top-8 right-8 px-3 py-1 bg-[#A5B4BC] text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                  En cours
                </span>
              </div>

              <div className="flex gap-2 mb-4">
                <a
                  href={getModuleUrl(module.name)}
                  className="px-4 py-2 border border-[#E67E22] text-[#E67E22] rounded-xl font-bold text-xs uppercase hover:bg-orange-50 transition-colors"
                >
                  Ouvrir
                </a>
              </div>

              <div className="mt-auto pt-4 flex items-center">
                <button
                  onClick={() => openDeleteModal(module)}
                  className="p-2 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <Image
                    src="/assets/icons/bin.svg"
                    width={20}
                    height={20}
                    alt="Supprimer"
                    className="w-5 h-5 opacity-40 grayscale"
                  />
                </button>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
            <Image src="/assets/icons/recrutement.svg" width={48} height={48} alt="Empty" className="opacity-20 translate-y-1" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Aucun module activé</h2>
          <p className="text-neutral-500 max-w-sm mb-8">
            Cliquez sur le bouton pour commencer à configurer vos outils de gestion.
          </p>
          <button
            onClick={() => setAddOpen(true)}
            className="bg-[#E67E22] hover:bg-[#D35400] text-white font-bold rounded-xl px-10 py-3 transition-colors"
          >
            DÉCOUVRIR LES MODULES +
          </button>
        </div>
      )}

      <ConfirmationModal
        open={confirmOpen}
        title="Supprimer le module"
        message={`Voulez-vous supprimer "${pendingModule?.name ?? ''}" ?`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancel}
      />

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-7xl h-[90vh] p-0 overflow-hidden flex flex-col bg-white !rounded-3xl border-none">
          <DialogTitle className="sr-only">Ajouter un module</DialogTitle>
          <div className="flex flex-1 overflow-hidden">
            {/* Colonne Gauche - Liste des modules */}
            <div className="w-[450px] border-r border-neutral-100 flex flex-col p-8 bg-white overflow-y-auto">
              <div className="mb-8 flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer hover:bg-neutral-50" onClick={() => setAddOpen(false)}>
                  <span className="text-xs">«</span>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {MODULE_PREVIEW_DATA.map((mod) => (
                  <div
                    key={mod.name}
                    onClick={() => setSelectedPreview(mod)}
                    className={`flex items-center gap-6 p-6 rounded-2xl border-2 transition-all cursor-pointer ${selectedPreview.name === mod.name ? 'border-[#E67E22] bg-white shadow-lg' : 'border-neutral-50 bg-[#F9FAFB] hover:border-neutral-200'
                      }`}
                  >
                    <div className="w-24 h-16 bg-neutral-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <Image src={mod.image} fill alt={mod.name} className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <Image src={mod.icon} width={18} height={18} alt="" />
                        <span className="font-bold text-slate-800 text-sm">{mod.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-[9px] px-2 py-1.5 border border-[#E67E22] text-[#E67E22] rounded-lg font-bold uppercase hover:bg-orange-50">
                          Prévisualiser
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAddModule(mod.name); }}
                          className="text-[9px] px-2 py-1.5 bg-[#E67E22] text-white rounded-lg font-bold uppercase hover:bg-orange-600"
                        >
                          + Ajouter le module
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne Droite - Détails */}
            <div className="flex-1 flex flex-col p-12 bg-white overflow-y-auto">
              <div className="mb-10">
                <span className="text-xs text-neutral-400 uppercase tracking-[0.2em] font-bold">Fil d'ariane</span>
                <h2 className="text-4xl font-bold text-slate-800 mt-4 mb-6">{selectedPreview.name}</h2>
                <p className="text-neutral-500 leading-relaxed text-lg max-w-3xl">
                  {selectedPreview.description}
                </p>
              </div>

              <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden border border-neutral-100 shadow-xl mb-12">
                <Image src={selectedPreview.image} fill alt="Preview Large" className="object-cover" />
              </div>

              <div className="mt-auto pt-8 border-t border-neutral-50 flex justify-end items-center gap-8">
                <button
                  onClick={() => setAddOpen(false)}
                  className="text-[#E67E22] font-bold text-lg hover:underline"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleAddModule(selectedPreview.name)}
                  className="bg-[#E67E22] text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-orange-600 transition-all hover:-translate-y-1"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={subscriptionModal.show} onOpenChange={(open) => !open && window.location.reload()}>
        <DialogContent className="sm:max-w-[400px] text-center">
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-full ${subscriptionModal.type === 'add' ? 'bg-green-100' : 'bg-amber-100'}`}>
              <Image
                src={subscriptionModal.type === 'add' ? "/assets/icons/check.svg" : "/assets/icons/Planning.svg"}
                width={32}
                height={32}
                alt="Status"
              />
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              Abonnement mis à jour
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-neutral-600">
              {subscriptionModal.type === 'add'
                ? `Le module "${subscriptionModal.name}" a été ajouté à votre offre. Votre prochaine facture sera ajustée automatiquement.`
                : `Le module "${subscriptionModal.name}" a été retiré de votre offre. Les changements prendront effet immédiatement.`
              }
            </p>
          </div>
          <DialogFooter className="sm:justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-secondary-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-secondary-800 transition-colors"
            >
              COMPRIS
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
