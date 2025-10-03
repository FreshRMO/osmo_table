import React from 'react';
import Papa from 'papaparse';
import { MaterialRow } from './types';
import { groupRowsToFormulas } from './utils/groupCsv';
import { useStore } from './store';
import DataTable from './components/DataTable';
import MaterialsDropdown from './components/MaterialsDropdown';

function App() {
  const { setFormulas } = useStore();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          // Filter out empty rows that PapaParse might create
          const validRows = results.data.filter((row: any) => 
            row.formula_id && row.formula_name && row.material_id
          );
          
          const rows = validRows.map((row: any) => ({
            ...row,
            qty: parseFloat(row.qty) || 0,
            unit_cost: row.unit_cost ? parseFloat(row.unit_cost) : undefined,
          })) as MaterialRow[];
          
          const formulas = groupRowsToFormulas(rows);
          setFormulas(formulas);
        } catch (error) {
          console.error('Error parsing CSV:', error);
          alert('Error parsing CSV file. Please check the format.');
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        alert('Error reading CSV file.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">CSV Table Viewer</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Upload CSV File</h2>
          <form>
            <label htmlFor="csv-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Select a CSV file containing formula data
            </label>
            <input
              id="csv-upload"
              name="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              aria-describedby="csv-upload-help"
            />
            <p id="csv-upload-help" className="mt-2 text-sm text-gray-500">
              Choose a CSV file with columns: formula_id, formula_name, category, notes, material_id, material_name, qty, uom, unit_cost
            </p>
          </form>
          
          {selectedFile && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-800">
                    File selected: {selectedFile.name}
                  </p>
                  <p className="text-xs text-green-600">
                    Size: {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DataTable />
        <MaterialsDropdown />
      </div>
    </div>
  );
}

export default App;
