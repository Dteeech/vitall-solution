"use client"
import React from 'react'

type Props = {
  open: boolean
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmationModal({
  open,
  title = 'Confirmer',
  message = 'Êtes-vous sûr(e) ?',
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} aria-hidden />

      <div role="dialog" aria-modal="true" className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-neutral-700 mb-4">{message}</p>

        <div className="flex items-center justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-md border  border-neutral-200">{cancelLabel}</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-primary bg-red-500 text-white">{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
