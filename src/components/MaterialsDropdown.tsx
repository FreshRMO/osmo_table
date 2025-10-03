import React from 'react';
import Papa from 'papaparse';
import { useStore } from '../store';
import { Material } from '../types';

const MaterialsDropdown: React.FC = () => {
  const { formulas, selectedFormulaId, setSelectedFormulaId } = useStore();

  const selectedFormula = formulas.find(f => f.formula_id === selectedFormulaId);

  if (!selectedFormula) {
    return null;
  }

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return 'N/A';
    return `$${amount.toFixed(2)}`;
  };

  const exportToCSV = () => {
    if (!selectedFormula) return;

    // Prepare materials data for CSV export
    const materialsData = selectedFormula.materials.map(material => ({
      formula_id: selectedFormula.formula_id,
      formula_name: selectedFormula.name,
      category: selectedFormula.category || '',
      notes: selectedFormula.notes || '',
      material_id: material.material_id,
      material_name: material.material_name,
      qty: material.qty,
      uom: material.uom || '',
      unit_cost: material.unit_cost || '',
    }));

    // Convert to CSV
    const csv = Papa.unparse(materialsData);
    
    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedFormula.name.replace(/\s+/g, '_')}_materials.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Formula for: {selectedFormula.name}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
          <button
            onClick={() => setSelectedFormulaId(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Material Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                UOM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Line Cost
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {selectedFormula.materials.map((material) => (
              <tr key={material.material_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {material.material_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {material.qty}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {material.uom || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(material.unit_cost)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(
                    material.unit_cost !== undefined 
                      ? material.qty * material.unit_cost 
                      : undefined
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedFormula.total_cost !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Cost:</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(selectedFormula.total_cost)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Formula Details */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong className="text-gray-700">Creator:</strong> {selectedFormula.creator || 'N/A'}
          </div>
          <div>
            <strong className="text-gray-700">Category:</strong> {selectedFormula.category || 'N/A'}
          </div>
          <div>
            <strong className="text-gray-700">Created:</strong> {
              selectedFormula.created_at 
                ? new Date(selectedFormula.created_at).toLocaleDateString()
                : 'N/A'
            }
          </div>
          {selectedFormula.notes && (
            <div className="md:col-span-2">
              <strong className="text-gray-700">Notes:</strong> {selectedFormula.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialsDropdown;
