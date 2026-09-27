import { expect, it } from 'vitest'
import { ago, initials, stamp } from './ui.ts'

it('formats relative times', () => {
  const now = Date.parse('2026-09-26T12:00:00Z')
  const at = (ms: number) => new Date(now - ms).toISOString()
  expect(ago(at(5_000), now)).toBe('just now')
  expect(ago(at(5 * 60_000), now)).toBe('5 minutes ago')
  expect(ago(at(3 * 3_600_000), now)).toBe('3 hours ago')
  expect(ago(at(26 * 3_600_000), now)).toBe('yesterday')
  expect(ago(at(4 * 86_400_000), now)).toBe('4 days ago')
})

it('stamps activity: relative within the hour, then day and time', () => {
  const now = new Date(2026, 8, 26, 15, 0).getTime()
  const at = (d: number, h: number, m: number) => new Date(2026, 8, d, h, m).toISOString()
  expect(stamp(at(26, 14, 48), now)).toBe('12 minutes ago')
  expect(stamp(at(26, 15, 0), now)).toBe('Just now')
  expect(stamp(at(26, 9, 26), now)).toMatch(/^Today, 9:26\sAM$/)
  expect(stamp(at(25, 13, 18), now)).toMatch(/^Yesterday, 1:18\sPM$/)
  expect(stamp(at(22, 11, 6), now)).toMatch(/^Sep 22, 11:06\sAM$/)
})

it('makes initials', () => {
  expect(initials('Maya K.')).toBe('MK')
  expect(initials('Guest')).toBe('G')
  expect(initials('  ana  maría lópez ')).toBe('AM')
})
