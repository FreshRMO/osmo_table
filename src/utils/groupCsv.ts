import { MaterialRow, Formula, Material } from '../types';

/**
 * This is the most important part of the project, the formatting of the data.
 * I based this off the current sample-data formulas.csv
 * Groups flat CSV rows into structured Formula objects
 * @param rows - Array of MaterialRow objects from parsed CSV data
 * @returns Array of Formula objects with grouped materials and calculated totals
 * @example
 * ```typescript
 * const formulas = groupRowsToFormulas(csvRows);
 * // Returns: [{ formula_id: 'F001', name: 'Sunrise Burst', materials: [...], total_cost: 8.40 }]
 * ```
 */
export function groupRowsToFormulas(rows: MaterialRow[]): Formula[] {
  // Group rows by formula_id
  const groupedRows = rows.reduce((acc, row) => {
    if (!acc[row.formula_id]) {
      acc[row.formula_id] = [];
    }
    acc[row.formula_id].push(row);
    return acc;
  }, {} as Record<string, MaterialRow[]>);

  // Convert grouped rows to Formula objects
  const formulas: Formula[] = Object.values(groupedRows).map(formulaRows => {
    const firstRow = formulaRows[0];
    
    // Create materials array
    const materials: Material[] = formulaRows.map(row => ({
      material_id: row.material_id,
      material_name: row.material_name,
      qty: row.qty,
      uom: row.uom,
      unit_cost: row.unit_cost,
    }));
    
    // Calculate total cost if unit_cost is present
    const total_cost = materials.reduce((sum, material) => {
      if (material.unit_cost !== undefined) {
        return sum + (material.qty * material.unit_cost);
      }
      return sum;
    }, 0);

    return {
      formula_id: firstRow.formula_id,
      name: firstRow.formula_name,
      category: firstRow.category,
      notes: firstRow.notes,
      materials,
      materials_count: formulaRows.length,
      total_cost: total_cost > 0 ? total_cost : undefined,
    };
  });

  return formulas;
}
