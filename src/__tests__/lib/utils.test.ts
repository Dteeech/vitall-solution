import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn()', () => {
  it('fusionne les classes simples', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('gère les classes conditionnelles', () => {
    expect(cn('base', false && 'hidden', 'end')).toBe('base end')
  })

  it('résout les conflits Tailwind', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6')
  })

  it('retourne une chaîne vide sans argument', () => {
    expect(cn()).toBe('')
  })
})
