export type Material = {
  material_id: string;
  material_name: string;
  qty: number;
  uom?: string;
  unit_cost?: number;
};

export type Formula = {
  formula_id: string;
  name: string;
  category?: string;
  notes?: string;
  materials: Material[];
  materials_count: number;
  total_cost?: number;
};

export type MaterialRow = {
  formula_id: string;
  formula_name: string;
  category?: string;
  notes?: string;
  material_id: string;
  material_name: string;
  qty: number;
  uom?: string;
  unit_cost?: number;
};
