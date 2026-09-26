import { expect, it } from 'vitest'
import { ago } from './ui.ts'

it('formats relative times', () => {
  const now = Date.parse('2026-09-26T12:00:00Z')
  const at = (ms: number) => new Date(now - ms).toISOString()
  expect(ago(at(5_000), now)).toBe('just now')
  expect(ago(at(5 * 60_000), now)).toBe('5 minutes ago')
  expect(ago(at(3 * 3_600_000), now)).toBe('3 hours ago')
  expect(ago(at(26 * 3_600_000), now)).toBe('yesterday')
  expect(ago(at(4 * 86_400_000), now)).toBe('4 days ago')
})
