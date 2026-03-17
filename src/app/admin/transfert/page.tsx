'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-toastify'
import { X, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ─── Types ────────────────────────────────────────────────────────────────────

type TransferStatus = 'EN_COURS' | 'TERMINE' | 'REFUSE'
type TransferType = 'DEMANDE' | 'PROPOSITION'

interface Organization {
  id: string
  name: string
}

interface Transfer {
  id: string
  fromOrganizationId: string
  toOrganizationId: string | null
  candidateName: string
  applicationDate: string | null
  exchangeDate: string | null
  status: TransferStatus
  type: TransferType
  notes: string | null
  createdAt: string
  fromOrganization: Organization
  toOrganization: Organization | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

function StatusBadge({ status }: { status: TransferStatus }) {
  const styles: Record<TransferStatus, string> = {
    EN_COURS: 'bg-orange-100 text-orange-700 border border-orange-200',
    TERMINE: 'bg-green-100 text-green-700 border border-green-200',
    REFUSE: 'bg-red-100 text-red-700 border border-red-200',
  }
  const labels: Record<TransferStatus, string> = {
    EN_COURS: 'En cours',
    TERMINE: 'Terminé',
    REFUSE: 'Refusé',
  }
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TransfertPage() {
  const { user } = useAuth()

  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)

  const [showDemandeModal, setShowDemandeModal] = useState(false)
  const [showTransfertModal, setShowTransfertModal] = useState(false)

  // Form state — Demande
  const [demandeOrg, setDemandeOrg] = useState('')
  const [demandeNotes, setDemandeNotes] = useState('')
  const [demandeName, setDemandeName] = useState('')
  const [submittingDemande, setSubmittingDemande] = useState(false)

  // Form state — Proposition/Transfert
  const [propCandidat, setPropCandidat] = useState('')
  const [propOrg, setPropOrg] = useState('')
  const [propExchangeDate, setPropExchangeDate] = useState('')
  const [propAppDate, setPropAppDate] = useState('')
  const [propNotes, setPropNotes] = useState('')
  const [submittingProp, setSubmittingProp] = useState(false)

  // ─── Fetch data ─────────────────────────────────────────────────────────────

  const fetchTransfers = async () => {
    try {
      const res = await fetch('/api/recrutement/transfers')
      if (res.ok) {
        const data = await res.json()
        setTransfers(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrganizations = async () => {
    try {
      const res = await fetch('/api/organization/list')
      if (res.ok) {
        const data = await res.json()
        setOrganizations(data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchTransfers()
    fetchOrganizations()
  }, [])

  // ─── Derived data ────────────────────────────────────────────────────────────

  const myOrgId = user?.organizationId

  // Propositions entrantes en attente (une autre caserne nous propose un candidat)
  const incomingPending = transfers.filter(
    (t) =>
      t.type === 'PROPOSITION' &&
      t.toOrganizationId === myOrgId &&
      t.status === 'EN_COURS'
  )

  // Historique : tous les transferts sauf les propositions entrantes en cours
  const historique = transfers.filter(
    (t) => !(t.type === 'PROPOSITION' && t.toOrganizationId === myOrgId && t.status === 'EN_COURS')
  )

  // ─── Actions ─────────────────────────────────────────────────────────────────

  const handleStatusUpdate = async (id: string, status: TransferStatus) => {
    try {
      const res = await fetch(`/api/recrutement/transfers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        toast.success(status === 'TERMINE' ? 'Transfert accepté avec succès.' : 'Transfert refusé.')
        fetchTransfers()
      } else {
        toast.error('Une erreur est survenue.')
      }
    } catch {
      toast.error('Une erreur est survenue.')
    }
  }

  const handleDemande = async () => {
    if (!demandeName.trim()) return
    setSubmittingDemande(true)
    try {
      const res = await fetch('/api/recrutement/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'DEMANDE',
          candidateName: demandeName,
          toOrganizationId: demandeOrg || null,
          notes: demandeNotes || null,
        }),
      })
      if (res.ok) {
        toast.success('Demande de transfert envoyée.')
        setShowDemandeModal(false)
        setDemandeName('')
        setDemandeOrg('')
        setDemandeNotes('')
        fetchTransfers()
      } else {
        toast.error('Une erreur est survenue lors de la demande.')
      }
    } catch {
      toast.error('Une erreur est survenue lors de la demande.')
    } finally {
      setSubmittingDemande(false)
    }
  }

  const handleProposition = async () => {
    if (!propCandidat.trim()) return
    setSubmittingProp(true)
    try {
      const res = await fetch('/api/recrutement/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PROPOSITION',
          candidateName: propCandidat,
          toOrganizationId: propOrg || null,
          exchangeDate: propExchangeDate || null,
          applicationDate: propAppDate || null,
          notes: propNotes || null,
        }),
      })
      if (res.ok) {
        toast.success('Votre transfert a bien été effectué.')
        setShowTransfertModal(false)
        setPropCandidat('')
        setPropOrg('')
        setPropExchangeDate('')
        setPropAppDate('')
        setPropNotes('')
        fetchTransfers()
      } else {
        toast.error('Une erreur est survenue lors du transfert.')
      }
    } catch {
      toast.error('Une erreur est survenue lors du transfert.')
    } finally {
      setSubmittingProp(false)
    }
  }

  // ─── Other orgs (exclude own) ────────────────────────────────────────────────

  const otherOrgs = organizations.filter((o) => o.id !== myOrgId)

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Transfert</h1>
        <p className="text-sm text-gray-500 mt-1">
          {transfers.length} module{transfers.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* ── Incoming proposals (notifications) ── */}
      {incomingPending.length > 0 && (
        <div className="flex flex-col gap-3">
          {incomingPending.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-4 border border-gray-200 rounded-xl px-5 py-4 bg-white shadow-sm w-fit"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-semibold">
                  {t.candidateName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Proposition de transfert</p>
                  <p className="font-semibold text-sm">{t.candidateName}</p>
                  <p className="text-xs text-gray-400">De : {t.fromOrganization.name}</p>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                  onClick={() => handleStatusUpdate(t.id, 'REFUSE')}
                >
                  Refuser
                </Button>
                <Button
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => handleStatusUpdate(t.id, 'TERMINE')}
                >
                  Accepter
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CTA cards ── */}
      <div className="grid grid-cols-2 gap-6">
        {/* Demande */}
        <div className="rounded-2xl bg-orange-50 p-8 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Besoin d&apos;un candidat ?</h2>
          <p className="text-sm text-gray-600">
            Faites une demande pour recevoir un renfort dans votre caserne.
          </p>
          <div className="mt-2">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setShowDemandeModal(true)}
            >
              Demander
            </Button>
          </div>
        </div>

        {/* Proposition */}
        <div className="rounded-2xl bg-gray-100 p-8 flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Un candidat à proposer ?</h2>
          <p className="text-sm text-gray-600">
            Partagez un profil disponible dans votre caserne pour aider une autre équipe en besoin.
          </p>
          <div className="mt-2">
            <Button
              className="bg-gray-800 hover:bg-gray-900 text-white"
              onClick={() => setShowTransfertModal(true)}
            >
              Transférer
            </Button>
          </div>
        </div>
      </div>

      {/* ── Historique ── */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Historique</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-orange-500" />
          </div>
        ) : historique.length === 0 ? (
          <p className="text-sm text-gray-500">
            Il n&apos;y a aucun historique disponible pour le moment sur cette page.
          </p>
        ) : (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Candidat</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date de l&apos;échange</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Nouvelle caserne</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date de candidature</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">État</th>
                </tr>
              </thead>
              <tbody>
                {historique.map((t, i) => (
                  <tr
                    key={t.id}
                    className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-semibold">
                          {t.candidateName.charAt(0)}
                        </div>
                        <span className="font-medium">{t.candidateName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(t.exchangeDate)}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {t.type === 'PROPOSITION'
                        ? t.toOrganization?.name ?? '—'
                        : t.fromOrganization.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(t.applicationDate)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal Demande ── */}
      <Dialog open={showDemandeModal} onOpenChange={setShowDemandeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Demander un candidat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="demande-name">Profil recherché *</Label>
              <Input
                id="demande-name"
                placeholder="Ex: Sapeur-pompier qualifié"
                value={demandeName}
                onChange={(e) => setDemandeName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="demande-org">Caserne cible (optionnel)</Label>
              <select
                id="demande-org"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={demandeOrg}
                onChange={(e) => setDemandeOrg(e.target.value)}
              >
                <option value="">Toutes les casernes</option>
                {otherOrgs.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="demande-notes">Notes (optionnel)</Label>
              <Input
                id="demande-notes"
                placeholder="Précisions sur la demande..."
                value={demandeNotes}
                onChange={(e) => setDemandeNotes(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowDemandeModal(false)}>
                Annuler
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleDemande}
                disabled={submittingDemande || !demandeName.trim()}
              >
                {submittingDemande ? <Loader2 className="size-4 animate-spin" /> : 'Envoyer la demande'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Modal Transfert / Proposition ── */}
      <Dialog open={showTransfertModal} onOpenChange={setShowTransfertModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Proposer un candidat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="prop-candidat">Nom du candidat *</Label>
              <Input
                id="prop-candidat"
                placeholder="Prénom Nom"
                value={propCandidat}
                onChange={(e) => setPropCandidat(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prop-org">Caserne destinataire</Label>
              <select
                id="prop-org"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={propOrg}
                onChange={(e) => setPropOrg(e.target.value)}
              >
                <option value="">Sélectionner une caserne</option>
                {otherOrgs.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prop-exchange-date">Date d&apos;échange</Label>
              <Input
                id="prop-exchange-date"
                type="date"
                value={propExchangeDate}
                onChange={(e) => setPropExchangeDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prop-app-date">Date de candidature</Label>
              <Input
                id="prop-app-date"
                type="date"
                value={propAppDate}
                onChange={(e) => setPropAppDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prop-notes">Notes (optionnel)</Label>
              <Input
                id="prop-notes"
                placeholder="Informations complémentaires..."
                value={propNotes}
                onChange={(e) => setPropNotes(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowTransfertModal(false)}>
                Annuler
              </Button>
              <Button
                className="bg-gray-800 hover:bg-gray-900 text-white"
                onClick={handleProposition}
                disabled={submittingProp || !propCandidat.trim()}
              >
                {submittingProp ? <Loader2 className="size-4 animate-spin" /> : 'Transférer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
