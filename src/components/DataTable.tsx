import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  SortingState,
  flexRender,
} from '@tanstack/react-table';
import { useStore } from '../store';
import { Formula } from '../types';

const DataTable: React.FC = () => {
  const { 
    formulas, 
    search, 
    categoryFilter, 
    selectedFormulaId,
    setSelectedFormulaId 
  } = useStore();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [focusedCell, setFocusedCell] = React.useState<string | null>(null);

  // Filter formulas before passing to react-table
  const filteredFormulas = useMemo(() => {
    return formulas.filter(formula => {
      // Category filter
      if (categoryFilter && formula.category !== categoryFilter) {
        return false;
      }
      
      // Search filter
      if (search) {
        const searchValue = search.toLowerCase();
        const matchesName = formula.name.toLowerCase().includes(searchValue);
        const matchesCategory = formula.category && formula.category.toLowerCase().includes(searchValue);
        const matchesNotes = formula.notes && formula.notes.toLowerCase().includes(searchValue);
        
        if (!matchesName && !matchesCategory && !matchesNotes) {
          return false;
        }
      }
      
      return true;
    });
  }, [formulas, search, categoryFilter]);

  const columnHelper = createColumnHelper<Formula>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: info => info.getValue() || 'N/A',
      }),
      columnHelper.accessor('notes', {
        header: 'Description',
        cell: info => info.getValue() || 'N/A',
      }),
      columnHelper.accessor('materials_count', {
        header: 'Materials',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('total_cost', {
        header: 'Total Cost',
        cell: info => {
          const cost = info.getValue();
          if (cost === undefined) return 'N/A';
          return `$${cost.toFixed(2)}`;
        },
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: filteredFormulas,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const handleRowClick = (formulaId: string) => {
    setSelectedFormulaId(formulaId);
  };

  const handleCellFocus = (rowId: string, cellId: string) => {
    setFocusedCell(`${rowId}-${cellId}`);
  };

  const handleCellKeyDown = (e: React.KeyboardEvent, rowId: string, cellId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRowClick(rowId);
    }
  };

  if (formulas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">No formulas loaded. Please upload a CSV file.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <label htmlFor="search" className="sr-only">Search formulas</label>
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search"
              type="text"
              placeholder="Search formulas by name, category, or description..."
              value={search}
              onChange={(e) => {
                const { setSearch } = useStore.getState();
                setSearch(e.target.value);
              }}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {search && (
            <button
              onClick={() => {
                const { setSearch } = useStore.getState();
                setSearch('');
              }}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    onClick={header.column.getToggleSortingHandler()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        header.column.getToggleSortingHandler()?.(e);
                      }
                    }}
                    tabIndex={0}
                    role="columnheader"
                    aria-sort={
                      header.column.getIsSorted() === 'asc' ? 'ascending' :
                      header.column.getIsSorted() === 'desc' ? 'descending' : 'none'
                    }
                  >
                    <div className="flex items-center gap-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: '↑',
                        desc: '↓',
                      }[header.column.getIsSorted() as string] ?? ''}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr 
                key={row.id}
                className={`hover:bg-gray-50 ${
                  selectedFormulaId === row.original.formula_id ? 'bg-blue-50' : ''
                }`}
                role="row"
                aria-selected={selectedFormulaId === row.original.formula_id}
              >
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id} 
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                      focusedCell === `${row.id}-${cell.id}` ? 'ring-2 ring-blue-500' : ''
                    }`}
                    tabIndex={0}
                    role="gridcell"
                    onClick={() => handleRowClick(row.original.formula_id)}
                    onFocus={() => handleCellFocus(row.id, cell.id)}
                    onBlur={() => setFocusedCell(null)}
                    onKeyDown={(e) => handleCellKeyDown(e, row.original.formula_id, cell.id)}
                    aria-label={`${cell.column.columnDef.header}: ${flexRender(cell.column.columnDef.cell, cell.getContext())}. Click or press Enter to select this formula.`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredFormulas.length === 0 && formulas.length > 0 && (
        <div className="p-6 text-center">
          <p className="text-gray-500">No formulas match the current filters.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {filteredFormulas.length > 0 && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                      table.getFilteredRowModel().rows.length
                    )}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{table.getFilteredRowModel().rows.length}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    First
                  </button>
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Last
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
