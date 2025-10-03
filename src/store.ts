import { create } from 'zustand';
import { Formula } from './types';

interface StoreState {
  formulas: Formula[];
  search: string;
  categoryFilter: string | null;
  selectedFormulaId: string | null;
}

interface StoreActions {
  setFormulas: (formulas: Formula[]) => void;
  setSearch: (search: string) => void;
  setCategoryFilter: (category: string | null) => void;
  setSelectedFormulaId: (id: string | null) => void;
}

type Store = StoreState & StoreActions;

export const useStore = create<Store>((set) => ({
  // Initial state
  formulas: [],
  search: '',
  categoryFilter: null,
  selectedFormulaId: null,

  // Actions
  setFormulas: (formulas: Formula[]) => set({ formulas }),
  setSearch: (search: string) => set({ search }),
  setCategoryFilter: (category: string | null) => set({ categoryFilter: category }),
  setSelectedFormulaId: (id: string | null) => set({ selectedFormulaId: id }),
}));
