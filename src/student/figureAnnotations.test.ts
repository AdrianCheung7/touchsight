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

  it('aligns the lower callouts to their printed labels and leader lines', () => {
    expect(animalCellCallouts.cytoplasm).toMatchObject({
      label: [98, 625, 82, 19],
      leaders: ['M 180 633 L 257 542'],
    })
    expect(animalCellCallouts['golgi-apparatus']).toMatchObject({
      label: [0, 442, 90, 43],
      leaders: ['M 51 450 L 173 450'],
    })
    expect(animalCellCallouts['golgi-vesicle']).toMatchObject({
      label: [0, 551, 113, 28],
      leaders: ['M 112 563 L 194 496'],
    })
    expect(animalCellCallouts.peroxisome).toMatchObject({
      label: [500, 553, 112, 31],
      leaders: ['M 458 508 L 499 571'],
    })
  })

  it('links the one Ribosomes label to its separate target clusters', () => {
    expect(animalCellCallouts.ribosomes.hitSlop).toBe(20)
    expect(animalCellCallouts.ribosomes.extraAreas).toHaveLength(1)
  })
})
