import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { GeoSample } from '@/data/mockData';

interface Column<T> {
  key: keyof T;
  label: string;
  unit?: string;
  format?: (value: T[keyof T]) => string;
  sortable?: boolean;
  width?: string;
}

interface GeoTableProps<T extends { id: string; status?: string }> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  pageSize?: number;
  className?: string;
  onRowClick?: (row: T) => void;
}

type SortDirection = 'asc' | 'desc' | null;

export function GeoTable<T extends { id: string; status?: string }>({
  data,
  columns,
  isLoading = false,
  pageSize = 10,
  className = '',
  onRowClick,
}: GeoTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);

  const handleSort = (key: keyof T) => {
    if (sortColumn === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (key: keyof T) => {
    if (sortColumn !== key) return <ChevronsUpDown className="h-3 w-3 opacity-50" />;
    if (sortDirection === 'asc') return <ChevronUp className="h-3 w-3" />;
    return <ChevronDown className="h-3 w-3" />;
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-accent" aria-label="Válido" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-strata-amber" aria-label="Alerta" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" aria-label="Erro" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className={`strata-card overflow-hidden ${className}`}>
        <div className="overflow-x-auto">
          <table className="geo-table w-full" role="table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={String(col.key)} className="p-3 text-left">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={String(col.key)} className="p-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className={`strata-card overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="geo-table w-full" role="table" aria-label="Dados geológicos">
          <thead>
            <tr>
              <th className="w-10 p-3 text-center" aria-label="Status">
                <span className="sr-only">Status</span>
              </th>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'p-3 text-left',
                    col.sortable !== false && 'cursor-pointer select-none hover:bg-muted/30 transition-colors'
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  role={col.sortable !== false ? 'columnheader button' : 'columnheader'}
                  aria-sort={sortColumn === col.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <div className="flex items-center gap-2">
                    <span>
                      {col.label}
                      {col.unit && <span className="ml-1 text-xs opacity-60">({col.unit})</span>}
                    </span>
                    {col.sortable !== false && getSortIcon(col.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  'transition-colors',
                  onRowClick && 'cursor-pointer',
                  row.status === 'warning' && 'bg-strata-amber/5',
                  row.status === 'error' && 'bg-destructive/5'
                )}
                onClick={() => onRowClick?.(row)}
                role={onRowClick ? 'row button' : 'row'}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={(e) => {
                  if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onRowClick(row);
                  }
                }}
              >
                <td className="p-3 text-center">{getStatusIcon(row.status)}</td>
                {columns.map((col) => {
                  const value = row[col.key];
                  const displayValue = col.format ? col.format(value) : String(value ?? '—');
                  return (
                    <td key={String(col.key)} className="p-3 tabular-nums">
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, data.length)} de {data.length} registros
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Página anterior"
            >
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'ghost'}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setCurrentPage(pageNum)}
                    aria-label={`Página ${pageNum}`}
                    aria-current={currentPage === pageNum ? 'page' : undefined}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Próxima página"
            >
              Próximo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Pre-configured columns for GeoSample
export const geoSampleColumns: Column<GeoSample>[] = [
  { key: 'sample_id', label: 'ID Amostra', sortable: true, width: '100px' },
  { key: 'collection_date', label: 'Data Coleta', sortable: true },
  { key: 'depth_m', label: 'Prof.', unit: 'm', sortable: true, format: (v) => Number(v).toFixed(1) },
  { key: 'ph', label: 'pH', sortable: true, format: (v) => Number(v).toFixed(1) },
  { key: 'conductivity_us', label: 'Cond.', unit: 'μS/cm', sortable: true },
  { key: 'tds_mg_l', label: 'TDS', unit: 'mg/L', sortable: true },
  { key: 'ca_meq_l', label: 'Ca²⁺', unit: 'meq/L', format: (v) => Number(v).toFixed(2) },
  { key: 'mg_meq_l', label: 'Mg²⁺', unit: 'meq/L', format: (v) => Number(v).toFixed(2) },
  { key: 'na_meq_l', label: 'Na⁺', unit: 'meq/L', format: (v) => Number(v).toFixed(2) },
  { key: 'cl_meq_l', label: 'Cl⁻', unit: 'meq/L', format: (v) => Number(v).toFixed(2) },
  { key: 'so4_meq_l', label: 'SO₄²⁻', unit: 'meq/L', format: (v) => Number(v).toFixed(2) },
  { key: 'hco3_meq_l', label: 'HCO₃⁻', unit: 'meq/L', format: (v) => Number(v).toFixed(2) },
];

export default GeoTable;
