import { describe, it, expect } from 'vitest'
import { groupRowsToFormulas } from '../groupCsv'
import { MaterialRow } from '../../types'

describe('groupRowsToFormulas', () => {
  it('should group rows by formula_id', () => {
    const rows: MaterialRow[] = [
      {
        formula_id: 'F001',
        formula_name: 'Sunrise Burst',
        category: 'Fresh',
        notes: 'Bright citrus opening',
        material_id: 'M001',
        material_name: 'Lemon Oil',
        qty: 10,
        uom: 'g',
        unit_cost: 0.5,
      },
      {
        formula_id: 'F001',
        formula_name: 'Sunrise Burst',
        category: 'Fresh',
        notes: 'Bright citrus opening',
        material_id: 'M002',
        material_name: 'Orange Oil',
        qty: 5,
        uom: 'g',
        unit_cost: 0.4,
      },
      {
        formula_id: 'F002',
        formula_name: 'Moonlight Petals',
        category: 'Floral',
        notes: 'Elegant rose heart',
        material_id: 'M010',
        material_name: 'Rose Absolute',
        qty: 3,
        uom: 'g',
        unit_cost: 2.0,
      },
    ]

    const result = groupRowsToFormulas(rows)

    expect(result).toHaveLength(2)
    expect(result[0].formula_id).toBe('F001')
    expect(result[0].name).toBe('Sunrise Burst')
    expect(result[0].materials).toHaveLength(2)
    expect(result[0].materials_count).toBe(2)
    
    expect(result[1].formula_id).toBe('F002')
    expect(result[1].name).toBe('Moonlight Petals')
    expect(result[1].materials).toHaveLength(1)
    expect(result[1].materials_count).toBe(1)
  })

  it('should calculate total cost correctly', () => {
    const rows: MaterialRow[] = [
      {
        formula_id: 'F001',
        formula_name: 'Test Formula',
        material_id: 'M001',
        material_name: 'Material 1',
        qty: 10,
        uom: 'g',
        unit_cost: 0.5,
      },
      {
        formula_id: 'F001',
        formula_name: 'Test Formula',
        material_id: 'M002',
        material_name: 'Material 2',
        qty: 5,
        uom: 'g',
        unit_cost: 1.0,
      },
    ]

    const result = groupRowsToFormulas(rows)

    expect(result[0].total_cost).toBe(10) // (10 * 0.5) + (5 * 1.0) = 5 + 5 = 10
  })

  it('should handle materials without unit_cost', () => {
    const rows: MaterialRow[] = [
      {
        formula_id: 'F001',
        formula_name: 'Test Formula',
        material_id: 'M001',
        material_name: 'Material 1',
        qty: 10,
        uom: 'g',
        unit_cost: 0.5,
      },
      {
        formula_id: 'F001',
        formula_name: 'Test Formula',
        material_id: 'M002',
        material_name: 'Material 2',
        qty: 5,
        uom: 'g',
        // unit_cost is undefined
      },
    ]

    const result = groupRowsToFormulas(rows)

    expect(result[0].total_cost).toBe(5) // Only (10 * 0.5) = 5
  })

  it('should return undefined total_cost when no materials have unit_cost', () => {
    const rows: MaterialRow[] = [
      {
        formula_id: 'F001',
        formula_name: 'Test Formula',
        material_id: 'M001',
        material_name: 'Material 1',
        qty: 10,
        uom: 'g',
        // unit_cost is undefined
      },
    ]

    const result = groupRowsToFormulas(rows)

    expect(result[0].total_cost).toBeUndefined()
  })

  it('should preserve formula metadata from first row', () => {
    const rows: MaterialRow[] = [
      {
        formula_id: 'F001',
        formula_name: 'Sunrise Burst',
        category: 'Fresh',
        notes: 'Bright citrus opening',
        material_id: 'M001',
        material_name: 'Lemon Oil',
        qty: 10,
        uom: 'g',
        unit_cost: 0.5,
      },
      {
        formula_id: 'F001',
        formula_name: 'Sunrise Burst',
        category: 'Fresh',
        notes: 'Bright citrus opening',
        material_id: 'M002',
        material_name: 'Orange Oil',
        qty: 5,
        uom: 'g',
        unit_cost: 0.4,
      },
    ]

    const result = groupRowsToFormulas(rows)

    expect(result[0].category).toBe('Fresh')
    expect(result[0].notes).toBe('Bright citrus opening')
  })

  it('should handle empty array', () => {
    const result = groupRowsToFormulas([])
    expect(result).toHaveLength(0)
  })

  it('should handle optional fields correctly', () => {
    const rows: MaterialRow[] = [
      {
        formula_id: 'F001',
        formula_name: 'Minimal Formula',
        material_id: 'M001',
        material_name: 'Material 1',
        qty: 10,
        // category, notes, uom, unit_cost are all undefined
      },
    ]

    const result = groupRowsToFormulas(rows)

    expect(result[0].category).toBeUndefined()
    expect(result[0].notes).toBeUndefined()
    expect(result[0].materials[0].uom).toBeUndefined()
    expect(result[0].materials[0].unit_cost).toBeUndefined()
  })

  it('should create correct materials array structure', () => {
    const rows: MaterialRow[] = [
      {
        formula_id: 'F001',
        formula_name: 'Test Formula',
        material_id: 'M001',
        material_name: 'Lemon Oil',
        qty: 10,
        uom: 'g',
        unit_cost: 0.5,
      },
    ]

    const result = groupRowsToFormulas(rows)

    expect(result[0].materials).toEqual([
      {
        material_id: 'M001',
        material_name: 'Lemon Oil',
        qty: 10,
        uom: 'g',
        unit_cost: 0.5,
      },
    ])
  })
})
