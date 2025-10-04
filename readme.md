# Fragrance Formula Manager

A React/TypeScript application for perfumers to browse and manage fragrance formulas.
Time Boxed to 2 and a half hours.

https://osmo-table-yhag.vercel.app/ -> deployed app.

To run locally, follow setup instructions and use Node v20+

## Features Implemented

- **Formula Table**: Sortable table displaying all formulas
- **Column Sorting**: Click headers to sort by name, cost, materials, etc.
- **Search**: Filter formulas by name, category, or description
- **Formula Details**: Click any row to view complete material breakdown
- **Material Display**: Shows quantities, unit costs, and line costs
- **Metadata**: Displays creator, category, creation date, and notes
- **Category Filter**: Dropdown to filter by fragrance category
- **Cost Calculation**: Automatic total cost calculation per formula
- **CSV Export**: Export individual formulas to CSV format

## Technical Approach

### Data Transformation
The CSV parsing handles the key challenge of transforming flat rows into nested formula objects:

1. **Parsing**: Papa Parse reads CSV with header detection and type coercion
2. **Grouping**: Custom `groupRowsToFormulas()` utility groups materials by `formula_id`
3. **Aggregation**: Calculates total costs and material counts per formula
4. **Validation**: Filters invalid rows and handles missing data gracefully

### State Management
- **Zustand**: Lightweight global state for formulas, filters, and selection
- **React State**: Local state for sorting, loading, and form interactions
- **Computed Values**: useMemo for efficient filtering and calculations

### UX Decisions
- **Inline Search**: Immediate filtering without submit button for faster browsing
- **Visual Selection**: Selected formula highlighted in blue for context
- **Responsive Design**: Mobile-friendly with collapsible pagination
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Empty States**: Helpful messages when no data or no results found
- **Loading States**: Visual feedback during CSV processing

### Performance Optimizations
- **Memoization**: useMemo for filtered data and column definitions
- **Pagination**: TanStack Table handles large datasets efficiently and provides easier out the box pagination/accessibility
- **Controlled Re-renders**: Zustand prevents unnecessary component updates

## Tech Stack

- **React 18** with TypeScript
- **TanStack Table v8**: Robust table functionality with sorting and pagination
- **Zustand**: Minimal state management
- **Papa Parse**: CSV parsing and generation
- **Tailwind CSS**: Utility-first styling

## Setup Instructions
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests once
npm run test:run

# Run tests in watch mode
npm run test

# Run tests with web UI
npm run test:ui

Usage

Upload CSV: Click "Choose file" and select your formula CSV
Browse Formulas: Use search and category filter to find formulas
View Details: Click any row to see full material breakdown
Export: Click "Export CSV" to download formula data

CSV Format
Expected columns:

formula_id: Unique identifier
formula_name: Display name
category: Fragrance category (floral, woody, fresh, etc.)
notes: Description or usage notes
material_id: Unique material identifier
material_name: Display name for material
qty: Quantity of material
uom: Unit of measure (ml, g, etc.)
unit_cost: Cost per unit (optional)
creator: Formula creator (optional)
created_at: Creation date (optional)

Assumptions & Trade-offs
Assumptions

CSV Structure: Each formula has multiple rows (one per material) Didn't see any CSV so created my own, please use and download top right.
Unique IDs: formula_id uniquely identifies formulas
Numeric Values: qty and unit_cost are parseable as numbers
Browser Environment: Modern browser with ES6+ support, please don't try to use with explorer

Trade-offs

Client-side Processing: All data loaded in memory

✓ Simple architecture, no backend needed
✗ Not suitable for extremely large datasets (10,000+ formulas)


Single Selection: Only one formula can be viewed at a time

✓ Cleaner UI, easier to implement
✗ Can't compare multiple formulas side-by-side (future enhancement)


In-memory Filtering: Filtering happens in React

✓ Instant results, no network latency
✗ Not scalable


CSV Only: Only CSV import/export

✓ Universal format, easy to use
✗ No PDF export (would require additional library like jsPDF)



Future Enhancements
If more time were available:

Formula Comparison: Multi-select formulas to compare materials side-by-side. Would like to implement a tab like structure for viewing single or multiple formulas.
PDF Export: Generate formatted PDF reports.
Batch Operations: Edit or delete multiple formulas.
Formula Creation: Add new formulas directly in the UI.
Cost Analysis: Charts showing cost breakdowns by category, cool ChartJS pie chart would be great.
Advanced Search: Search by specific materials or cost ranges

Questions About Domain

Material Substitutions: Do perfumers need to see alternative materials?
Dilution Ratios: Should the app handle concentration calculations? I saw chemical compositions on the website. 
Version History: Should formula changes be tracked over time?
Accessibililty: What levels of accessibility are we looking for? AA? AAA?