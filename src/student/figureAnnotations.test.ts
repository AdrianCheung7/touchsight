import { describe, expect, it } from 'vitest'
import animalCell from '../data/figures/animal-cell.json'
import { animalCellCallouts } from './figureAnnotations.ts'

describe('animalCellCallouts', () => {
  it('maps every cell region to an existing label box and leader line', () => {
    expect(Object.keys(animalCellCallouts).sort()).toEqual(animalCell.regions.map(({ id }) => id).sort())
    for (const callout of Object.values(animalCellCallouts)) {
      const [x, y, width, height] = callout.label
      expect(x).toBeGreaterThanOrEqual(0)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(x + width).toBeLessThanOrEqual(animalCell.width)
      expect(y + height).toBeLessThanOrEqual(animalCell.height)
      expect(callout.leaders.length).toBeGreaterThan(0)
    }
  })
})
